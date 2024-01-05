import { Router } from 'express'
import {
  MOD_SANCTION_TYPES,
  MOD_STATUS,
  MOD_TYPES,
  deleteUser,
  getSanctionByUser,
  getSanctions,
  getSanctionsByUser,
  getUser,
  getUsers,
  removeSanction,
  updateUser,
} from '../lib/manageApp'
import Mod from '../database/models/Mod.model'
import { isValidObjectId } from 'mongoose'
import { ms } from '../lib/ms'
const router = Router()

/* HOME */
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

/* SANCTIONS */
router.get('/sanctions/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    if (!isValidObjectId(userId)) throw Error('invalid_user_id')

    if (req.user.roles.includes('admin'))
      return res.render('manage/sanctions/user', {
        user: await getUser(userId, 'mod'),
        sanctions: await getSanctionsByUser(userId, { include_mod: true }),
      })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.get('/sanctions/new/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    if (!isValidObjectId(userId)) throw Error('invalid_user_id')

    if (req.user.roles.includes('admin'))
      return res.render('manage/sanctions/new', {
        moderator: req.user,
        user: await getUser(userId, 'mod'),
      })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.post('/sanctions/new/:userId', async (req, res) => {
  try {
    if (req.user.roles.includes('admin') || req.user.roles.includes('mod')) {
      const { userId } = req.params
      const { subject, content, sanction_type, sanction_time } = req.body
      const sanctionTimeParsed = ms(sanction_time)
      if (!isValidObjectId(userId)) throw Error('invalid_user_id')
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

router.get('/sanctions/details/:sanctionId', async (req, res) => {
  try {
    const { sanctionId } = req.params
    if (!isValidObjectId(sanctionId)) throw Error('invalid_sanction_id')

    if (req.user.roles.includes('admin'))
      return res.render('manage/sanctions/details', {
        sanction: await getSanctionByUser(sanctionId, {
          include_user: true,
          include_mod: true,
        }),
      })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.get('/sanctions/remove/:sanctionId', async (req, res) => {
  try {
    const { sanctionId } = req.params
    const { userId } = req.query
    if (!isValidObjectId(sanctionId)) throw Error('invalid_sanction_id')
    if (!isValidObjectId(userId)) throw Error('invalid_user_id')

    if (req.user.roles.includes('admin')) {
      await removeSanction(sanctionId)
      return res.redirect(`/manage/sanctions/${userId}`)
    }
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

/** USERS **/
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    if (!isValidObjectId(userId)) throw Error('invalid_user_id')

    if (req.user.roles.includes('admin'))
      return res.render('manage/users/user', {
        user: await getUser(userId, 'mod'),
        perms_to_delete_users: req.user.roles.includes('admin') ? true : false,
      })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.post('/users/edit/:userId', async (req, res) => {
  try {
    if (req.user.roles.includes('admin')) {
      const { userId } = req.params
      const { username, display_name } = req.body
      if (!isValidObjectId(userId)) throw Error('invalid_user_id')
      if (username.length < 3) throw Error('username_too_short')
      if (username.length > 28) throw Error('username_too_long')
      if (username.length > 50) throw Error('display_name_too_long')
      if (display_name.length < 1) throw Error('display_name_too_short')

      await updateUser(userId, { username, display_name })
      res.status(200).json({ ok: true })
    }
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.post('/users/delete/:userId', async (req, res) => {
  try {
    if (req.user.roles.includes('admin')) {
      const { userId } = req.params
      if (!isValidObjectId(userId)) throw Error('invalid_user_id')

      await deleteUser(userId)
      res.status(200).json({ ok: true })
    }
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

export default router
