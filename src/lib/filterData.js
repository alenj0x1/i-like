import { getPosts, getSpace, getSpaces, getTopic, getUser } from './manageApp'

export function filterUserData(user, role) {
  switch (role) {
    case 'mod':
      return {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        like: user.like,
        roles: user.roles,
        status: user.status,
        account_status: user.account_status,
        created_account: user.createdAt,
        last_change_account: user.updatedAt,
      }
    default:
      return {
        id: user._id.toString(),
        username: user.username,
        display_name: user.display_name,
        like: user.like,
        roles: user.roles,
        status: user.status,
        account_status: user.account_status,
        created_account: user.createdAt,
      }
  }
}

export function filterUsersData(users) {
  return users.map((user) => {
    return {
      id: user._id.toString(),
      username: user.username,
      display_name: user.display_name,
      like: user.like,
      roles: user.roles,
      created_account: user.createdAt,
      last_change_account: user.updatedAt,
    }
  })
}

export async function filterSanctionData(sanction, obj) {
  return {
    id: sanction._id,
    moderators: obj.include_mod
      ? await Promise.all(sanction.moderators.map(async (modId) => await getUser(modId, 'manage')))
      : sanction.moderators,
    user: obj.include_user ? await getUser(sanction.user) : sanction.user,
    subject: sanction.subject,
    content: sanction.content,
    interactions: sanction.interactions,
    status: sanction.status,
    sanction: sanction.sanction_type,
    time: sanction.sanction_time,
    created: sanction.createdAt,
    updated: sanction.updatedAt,
  }
}

export async function filterSanctionsData(sanctions, obj) {
  return obj.include_mod || obj.include_user
    ? await Promise.all(sanctions.map(async (sanction) => await filterSanctionData(sanction, obj)))
    : sanctions
}

export async function filterTopicData(topic, obj) {
  return {
    id: topic._id,
    name: topic.name,
    description: topic.description,
    banner: topic.banner,
    spaces: obj.include_spaces
      ? await Promise.all(
          topic.spaces.map(async (spaceId) => await getSpace(spaceId.toString(), obj))
        )
      : topic.spaces,
    created: topic.createdAt,
    updated: topic.updatedAt,
  }
}

export async function filterTopicsData(topics, obj) {
  return obj.include_spaces
    ? await Promise.all(topics.map(async (topic) => await filterTopicData(topic, obj)))
    : topics
}

export async function filterSpaceData(space, obj) {
  return {
    id: space._id,
    name: space.name,
    description: space.description,
    banner: space.banner,
    manager: obj.include_manager ? await getUser(space.manager, 'mod') : space.manager,
    topicId: obj.include_topic ? await getTopic(space.topicId, {}) : space.topicId,
    posts: obj.include_posts ? await getPosts(obj, space._id.toString()) : space.posts,
    created: space.createdAt,
    updated: space.updatedAt,
  }
}

export async function filterSpacesData(spaces, obj) {
  return obj.include_manager
    ? await Promise.all(spaces.map(async (space) => await filterSpaceData(space, obj)))
    : spaces
}

export async function filterPostData(post, obj) {
  return {
    id: post._id,
    title: post.title,
    content: post.content,
    banner: post.banner,
    author: obj.include_author ? await getUser(post.author, 'mod') : post.author,
    tags: post.tags,
    spaceId: obj.include_space ? await getSpace(post.spaceId, obj) : post.spaceId,
    created: post.createdAt,
    updated: post.updatedAt,
  }
}

export async function filterPostsData(posts, obj) {
  return obj.include_author || obj.include_space
    ? await Promise.all(posts.map(async (post) => await filterPostData(post, obj)))
    : posts
}
