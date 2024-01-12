import { Router } from 'express'
import { getTopic, getTopics } from '../lib/manageApp'
import { isValidObjectId } from 'mongoose'
const router = Router()

router.get('/', async (_req, res) => {
  res.render('topics/index', {
    topics: await getTopics({ include_spaces: true }),
  })
})

router.get('/:topicId', async (req, res) => {
  try {
    const { topicId } = req.params
    if (!isValidObjectId(topicId)) throw Error('topic_invalid_id')

    res.render('topics/view', {
      topic: await getTopic(topicId, {
        include_spaces: true,
        include_manager: true,
      }),
    })
  } catch (err) {
    res.status(404).send({ err: err.message })
  }
})

export default router
