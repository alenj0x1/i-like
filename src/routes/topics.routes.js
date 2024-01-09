import { Router } from 'express'
import { getTopics } from '../lib/manageApp'
const router = Router()

router.get('/', async (req, res) => {
  res.render('topics/index', {
    topics: await getTopics({ include_spaces: true }),
  })
})

export default router
