import { Router } from 'express'
import User from '../database/models/User.models'
import { hashPassword } from '../lib/managePassword'
const router = Router()

router.get('/register', (_req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  try {
    const {
      user_username,
      user_display_name,
      user_password,
      user_password_confirm,
      user_password_hint,
    } = req.body
    if (!user_username) throw Error('user_required')
    if (!user_display_name) throw Error('display_name_required')
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
    })
    await newUser.save()

    res.status(201).json({ ok: true })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

export default router
