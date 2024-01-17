import 'dotenv/config'
import { sign, verify } from 'jsonwebtoken'

export function createToken(userId) {
  return sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
  })
}

export function validateToken(token) {
  try {
    const validation = verify(token, process.env.JWT_SECRET_KEY)

    if (!validation) return { result: false, data: null }

    return { result: true, data: verify(token, process.env.JWT_SECRET_KEY) }
  } catch (err) {
    return { result: false, err: err.message }
  }
}
