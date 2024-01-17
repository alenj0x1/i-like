import { Router } from 'express'
import User from '../database/models/User.models'
import { isValidObjectId } from 'mongoose'
const router = Router()

router.get('/', async (req, res) => {
  try {
    res.render('settings.pug', {
      user: req.user,
    })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

export default router
