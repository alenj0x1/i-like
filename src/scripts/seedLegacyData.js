import 'dotenv/config'
import { connect, disconnect, Types } from 'mongoose'
import User from '../database/models/User.models'
import Topic from '../database/models/Topic.model'
import Space from '../database/models/Space.models'
import Post from '../database/models/Post.model'
import Follow from '../database/models/Follow.model'
import Mod from '../database/models/Mod.model'
import { hashPassword } from '../lib/managePassword'

const ids = {
  alpha: new Types.ObjectId('65f000000000000000000001'),
  beta: new Types.ObjectId('65f000000000000000000002'),
  moderator: new Types.ObjectId('65f000000000000000000003'),
  topic: new Types.ObjectId('65f000000000000000000010'),
  space: new Types.ObjectId('65f000000000000000000020'),
  orphanSpace: new Types.ObjectId('65f000000000000000000021'),
  post: new Types.ObjectId('65f000000000000000000030'),
  orphanPost: new Types.ObjectId('65f000000000000000000031'),
  absentUser: new Types.ObjectId('65f000000000000000000099'),
}

async function clearSyntheticData() {
  await Promise.all([
    User.deleteMany({ username: /^seed_/ }),
    Topic.deleteMany({ name: /^seed_/ }),
    Space.deleteMany({ name: /^seed_/ }),
    Post.deleteMany({ title: /^seed_/ }),
    Follow.deleteMany({ $or: [{ follower: /^65f000/ }, { followed: /^65f000/ }] }),
    Mod.deleteMany({ subject: /^seed_/ }),
  ])
}

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required')

  await connect(process.env.MONGODB_URI)
  await clearSyntheticData()

  await User.create([
    {
      _id: ids.alpha,
      username: 'seed_alpha',
      display_name: 'Seed Alpha',
      password: hashPassword('seed-password-1'),
      roles: ['user'],
      likes: { topics: [ids.topic, ids.topic], spaces: [ids.space], posts: [ids.post, ids.post] },
      favorites_posts: [ids.post, ids.orphanPost],
    },
    {
      _id: ids.beta,
      username: 'seed_beta',
      display_name: 'Seed Beta',
      password: hashPassword('seed-password-2'),
      roles: ['user'],
    },
    {
      _id: ids.moderator,
      username: 'seed_moderator',
      display_name: 'Seed Moderator',
      password: hashPassword('seed-password-3'),
      roles: ['mod'],
    },
  ])

  await Topic.create({
    _id: ids.topic,
    name: 'seed_community',
    description: 'Tema sintético para perfilar relaciones legacy.',
    spaces: [ids.space, ids.space, ids.orphanSpace],
  })

  await Space.create({
    _id: ids.space,
    name: 'seed_general',
    description: 'Espacio sintético con relaciones válidas y huérfanas.',
    manager: ids.alpha.toString(),
    topicId: ids.topic.toString(),
    posts: [ids.post, ids.post, ids.orphanPost],
  })

  await Space.create({
    _id: ids.orphanSpace,
    name: 'seed_orphan_manager',
    description: 'Espacio sintético cuyo gestor no existe.',
    manager: ids.absentUser.toString(),
    topicId: ids.topic.toString(),
  })

  await Post.create({
    _id: ids.post,
    title: 'seed_welcome_post',
    content: 'Publicación sintética de longitud suficiente para perfilar el flujo de migración.',
    author: ids.alpha.toString(),
    spaceId: ids.space.toString(),
    tags: ['seed', 'community'],
    likes: [ids.beta.toString(), ids.beta.toString(), ids.absentUser.toString()],
    comments: [{ user: ids.beta.toString(), content: 'Comentario sintético.' }],
  })

  await Post.create({
    _id: ids.orphanPost,
    title: 'seed_orphan_post',
    content: 'Publicación sintética con autor y espacio inexistentes para validar referencias.',
    author: ids.absentUser.toString(),
    spaceId: ids.absentUser.toString(),
  })

  await Follow.create([
    { follower: ids.alpha.toString(), followed: ids.beta.toString() },
    { follower: ids.alpha.toString(), followed: ids.beta.toString() },
    { follower: ids.absentUser.toString(), followed: ids.beta.toString() },
  ])

  await Mod.create([
    {
      type: 'report',
      moderators: [ids.moderator.toString()],
      user: ids.alpha.toString(),
      subject: 'seed_report_post',
      content: 'Reporte sintético pendiente de asignación y resolución.',
      status: 'pending',
    },
    {
      type: 'sanction',
      moderators: [ids.moderator.toString()],
      user: ids.absentUser.toString(),
      subject: 'seed_orphan_sanction',
      content: 'Sanción sintética con usuario inexistente.',
      status: 'pending',
      sanction_type: 'muted',
      sanction_time: 3600000,
    },
  ])

  console.log('Synthetic legacy data created: users=3, topics=1, spaces=2, posts=2, follows=3, mods=2')
}

seed()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnect()
  })
