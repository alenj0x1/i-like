import { Router } from 'express'
import User from '../database/models/User.models'
import { comparePassword } from '../lib/managePassword'
const router = Router()

router.get('/login', (_req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) => {
  try {
    const { user_username, user_password } = req.body
    if (!user_username) throw Error('user_required')
    if (!user_password) throw Error('password_required')

    const getUser = await User.findOne({ username: user_username })
    if (!getUser) throw Error('username_or_password_incorrect')

    const comparePasswords = comparePassword(user_password, getUser.password)
    console.log(comparePasswords)
    if (!comparePasswords) throw Error('username_or_password_incorrect')

    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

export default router
