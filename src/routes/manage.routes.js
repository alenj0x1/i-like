import { Router } from 'express'
import {
  MOD_SANCTION_TYPES,
  MOD_STATUS,
  MOD_TYPES,
  getSanctions,
  getSanctionsByUser,
  getUser,
  getUsers,
} from '../lib/manageApp'
import Mod from '../database/models/Mod.model'
import { isValidObjectId } from 'mongoose'
import { ms } from '../lib/ms'
const router = Router()

router.get('/', async (req, res) => {
  try {
    if (req.user.roles.includes('admin'))
      return res.render('manage/home', {
        users: await getUsers(),
        sanctions: await getSanctions({}),
      })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.get('/users', async (req, res) => {
  try {
    if (req.user.roles.includes('admin'))
      return res.render('manage/users', { users: await getUsers() })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.get('/sanctions', async (req, res) => {
  try {
    if (req.user.roles.includes('admin'))
      return res.render('manage/sanctions', {
        sanctions: await getSanctions({
          include_mod: true,
          include_user: true,
        }),
      })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.get('/sanctions/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    if (!isValidObjectId(userId)) throw Error('invalid_id')

    if (req.user.roles.includes('admin'))
      return res.render('manage/sanctionsUser', {
        user: await getUser(userId, 'mod'),
        sanctions: await getSanctionsByUser(userId, { include_mod: true }),
      })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.get('/newSanction/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    if (!isValidObjectId(userId)) throw Error('invalid_id')

    if (req.user.roles.includes('admin'))
      return res.render('manage/newSanction', {
        moderator: req.user,
        user: await getUser(userId, 'mod'),
      })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.post('/newSanction/:userId', async (req, res) => {
  try {
    if (req.user.roles.includes('admin') || req.user.roles.includes('mod')) {
      const { userId } = req.params
      const { subject, content, sanction_type, sanction_time } = req.body
      const sanctionTimeParsed = ms(sanction_time)
      if (!isValidObjectId(userId)) throw Error('invalid_id')
      if (!subject) throw Error('subject_missing')
      if (!content) throw Error('content_missing')
      if (!sanction_type) throw Error('sanction_type_missing')
      if (!sanction_time) throw Error('sanction_time_missing')
      if (sanctionTimeParsed.err) throw Error('sanction_time_invalid')
      if (!Object.keys(MOD_SANCTION_TYPES).includes(sanction_type))
        throw Error('sanction_type_not_valid')

      const newSanction = new Mod({
        type: MOD_TYPES['sanction'],
        moderators: [req.user.id],
        user: userId,
        subject,
        content,
        status: MOD_STATUS['pending'],
        sanction_type,
        sanction_time: sanctionTimeParsed.time,
      })

      await newSanction.save()

      res.status(201).json({ userId })
    }
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

export default router
