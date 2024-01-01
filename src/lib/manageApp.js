import User from '../database/models/User.models'
import { filterUsersData } from './filterData'

export async function getUsers() {
  return filterUsersData(await User.find({}))
}
