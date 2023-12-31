import { sign, verify } from 'jsonwebtoken'
import { filterUserData } from './filterData'

export function createToken(user) {
  const dataFiltered = filterUserData(user)

  return sign(dataFiltered, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
  })
}

export function validateToken(token) {
  return verify(token, process.env.JWT_SECRET_KEY)
}
