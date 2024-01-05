import { Router } from 'express'
import User from '../database/models/User.models'
import { hashPassword } from '../lib/managePassword'
import { createToken } from '../lib/manageToken'
const router = Router()

router.get('/', (_req, res) => {
  res.render('register')
})

router.post('/', async (req, res) => {
  try {
    const {
      user_username,
      user_display_name,
      user_password,
      user_password_confirm,
      user_password_hint,
    } = req.body
    if (!user_username) throw Error('username_required')
    if (user_username.length > 28) throw Error('username_too_long')
    if (user_username.length < 3) throw Error('username_too_short')
    if (!user_display_name) throw Error('display_name_required')
    if (user_display_name.length > 50) throw Error('display_name_too_long')
    if (!user_password) throw Error('password_required')
    if (!user_password_confirm) throw Error('password_confirm_required')

    if (user_password !== user_password_confirm)
      throw Error('password_confirm_is_not_equal')

    const findUser = await User.findOne({ username: user_username })
    if (findUser) throw Error('user_registered')

    const newUser = new User({
      username: user_username,
      display_name: user_display_name,
      password: hashPassword(user_password),
      password_hint: user_password_hint,
      roles: ['user'],
    })
    await newUser.save()

    const token = createToken(newUser.toJSON())

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: process.env.TOKEN_COOKIE_MAXAGE,
    })

    res.status(201).json({ ok: true })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

export default router
