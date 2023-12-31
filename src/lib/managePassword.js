import { hashSync, compareSync } from 'bcrypt'

export function hashPassword(password) {
  return hashSync(password, 10)
}

export function comparePasword(password, hash) {
  return compareSync(password, hash)
}
