import { Router } from 'express'
import User from '../database/models/User.models'
import { comparePassword } from '../lib/managePassword'
import { createToken } from '../lib/manageToken'
const router = Router()

router.get('/', (_req, res) => {
  res.render('login')
})

router.post('/', async (req, res) => {
  try {
    const { username_login, password_login } = req.body
    if (!username_login) throw Error('username_required')
    if (username_login.length < 3) throw Error('nope')
    if (!password_login) throw Error('password_required')
    if (password_login.length < 8) throw Error('nope')

    const getUser = await User.findOne({ username: username_login })
    if (!getUser) throw Error('username_or_password_incorrect')

    const comparePasswords = comparePassword(password_login, getUser.password)
    if (!comparePasswords) throw Error('username_or_password_incorrect')

    const token = createToken(getUser.toJSON())

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: process.env.TOKEN_COOKIE_MAXAGE,
    })

    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(404).json({ err: err.message, data: '🪑' })
  }
})

export default router
