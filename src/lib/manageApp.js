import User from '../database/models/User.models'
import Mod from '../database/models/Mod.model'
import {
  filterSanctionsData,
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

export async function getSanctionsByUser(user_id, obj) {
  const sanction = (await Mod.find({}))
    .filter((data) => data.type === 'sanction')
    .filter((data) => data.user.includes(user_id))

  return await filterSanctionsData(sanction, obj)
}

export async function getSanctions(obj) {
  const sanctions = (await Mod.find({})).filter(
    (sanction) => sanction.type === 'sanction'
  )

  return await filterSanctionsData(sanctions, obj)
}
