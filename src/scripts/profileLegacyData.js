import 'dotenv/config'
import { connect, disconnect } from 'mongoose'
import User from '../database/models/User.models'
import Topic from '../database/models/Topic.model'
import Space from '../database/models/Space.models'
import Post from '../database/models/Post.model'
import Follow from '../database/models/Follow.model'
import Mod from '../database/models/Mod.model'

const asText = (value) => String(value)
const duplicateCount = (values = []) => values.length - new Set(values.map(asText)).size
const missingCount = (values, existing) => values.filter((value) => !existing.has(asText(value))).length

async function profile() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required')
  await connect(process.env.MONGODB_URI)

  const [users, topics, spaces, posts, follows, mods] = await Promise.all([
    User.find({}).lean(),
    Topic.find({}).lean(),
    Space.find({}).lean(),
    Post.find({}).lean(),
    Follow.find({}).lean(),
    Mod.find({}).lean(),
  ])

  const userIds = new Set(users.map((item) => asText(item._id)))
  const topicIds = new Set(topics.map((item) => asText(item._id)))
  const spaceIds = new Set(spaces.map((item) => asText(item._id)))
  const postIds = new Set(posts.map((item) => asText(item._id)))
  const followPairs = new Map()

  for (const follow of follows) {
    const key = `${follow.follower}:${follow.followed}`
    followPairs.set(key, (followPairs.get(key) ?? 0) + 1)
  }

  const result = {
    counts: { users: users.length, topics: topics.length, spaces: spaces.length, posts: posts.length, follows: follows.length, mods: mods.length },
    duplicates: {
      topicSpaceArrays: topics.reduce((total, topic) => total + duplicateCount(topic.spaces), 0),
      spacePostArrays: spaces.reduce((total, space) => total + duplicateCount(space.posts), 0),
      userPostLikes: users.reduce((total, user) => total + duplicateCount(user.likes?.posts), 0),
      postLikes: posts.reduce((total, post) => total + duplicateCount(post.likes), 0),
      followPairs: [...followPairs.values()].reduce((total, count) => total + Math.max(0, count - 1), 0),
    },
    orphanReferences: {
      topicSpaces: topics.reduce((total, topic) => total + missingCount(topic.spaces ?? [], spaceIds), 0),
      spaceManagers: spaces.filter((space) => !userIds.has(asText(space.manager))).length,
      spaceTopics: spaces.filter((space) => !topicIds.has(asText(space.topicId))).length,
      spacePosts: spaces.reduce((total, space) => total + missingCount(space.posts ?? [], postIds), 0),
      postAuthors: posts.filter((post) => !userIds.has(asText(post.author))).length,
      postSpaces: posts.filter((post) => !spaceIds.has(asText(post.spaceId))).length,
      followUsers: follows.filter((follow) => !userIds.has(asText(follow.follower)) || !userIds.has(asText(follow.followed))).length,
      moderationUsers: mods.filter((mod) => !userIds.has(asText(mod.user))).length,
    },
  }

  console.log(JSON.stringify(result, null, 2))
}

profile()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnect()
  })
