import { Router } from 'express'
import { getUsers } from '../lib/manageApp'
const router = Router()

router.get('/', async (req, res) => {
  if (req.user.roles.includes('admin'))
    return res.render('manage/home', { users: await getUsers() })
})

router.get('/users', async (req, res) => {
  if (req.user.roles.includes('admin'))
    return res.render('manage/users', { users: await getUsers() })
})

export default router
