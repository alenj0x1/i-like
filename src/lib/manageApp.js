import User from '../database/models/User.models'
import Mod from '../database/models/Mod.model'
import Topic from '../database/models/Topic.model'
import {
  filterSanctionData,
  filterSanctionsData,
  filterTopicData,
  filterTopicsData,
  filterUserData,
  filterUsersData,
} from './filterData'

export const USER_ROLES = {
  admin: 'admin',
  mod: 'mod',
  support: 'support',
  user: 'user',
}
export const MOD_TYPES = {
  sanction: 'sanction',
  support: 'support',
  report: 'report',
}
export const MOD_SANCTION_TYPES = { muted: 'muted', banned: 'banned' }
export const MOD_STATUS = {
  pending: 'pending',
  opened: 'opened',
  closed: 'closed',
}

export async function getUser(user_id, role) {
  return filterUserData(await User.findById(user_id), role)
}

export async function getUsers() {
  return filterUsersData(await User.find({}))
}

export async function updateUser(user_id, data) {
  return User.findByIdAndUpdate(user_id, {
    username: data.username,
    display_name: data.display_name,
  })
}

export async function deleteUser(user_id) {
  return User.findByIdAndDelete(user_id)
}

export async function getSanctionByUser(sanction_id, obj) {
  return await filterSanctionData(await Mod.findById(sanction_id), obj)
}

export async function getSanctions(obj) {
  const sanctions = (await Mod.find({})).filter(
    (sanction) => sanction.type === 'sanction'
  )

  return await filterSanctionsData(sanctions, obj)
}

export async function getSanctionsByUser(user_id, obj) {
  const sanction = (await Mod.find({}))
    .filter((data) => data.type === 'sanction')
    .filter((data) => data.user.includes(user_id))

  return await filterSanctionsData(sanction, obj)
}

export async function removeSanction(sanction_id) {
  return await Mod.findByIdAndUpdate(sanction_id, {
    status: MOD_STATUS['closed'],
  })
}

export async function getTopics(obj) {
  const topics = await Topic.find({})

  return await filterTopicsData(topics, obj)
}

export async function getTopic(topic_id, obj) {
  const topic = await Topic.findById(topic_id)

  return await filterTopicData(topic, obj)
}

export async function updateTopic(topic_id, data) {
  return Topic.findByIdAndUpdate(topic_id, {
    name: data.name,
    description: data.description,
    banner: data.banner,
  })
}

export async function deleteTopic(topic_id) {
  return Topic.findByIdAndDelete(topic_id)
}
