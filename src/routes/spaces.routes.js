import { Router } from 'express'
import { getTopics } from '../lib/manageApp'
import { isValidUrl } from '../lib/validate'
import Space from '../database/models/Space.models'
import Topic from '../database/models/Topic.model'
const router = Router()

router.get('/new', async (req, res) => {
  res.render('spaces/new', { user: req.user, topics: await getTopics({}) })
})

// Create a space
router.post('/new', async (req, res) => {
  try {
    const { name, description, banner, topic } = req.body
    if (!name) throw Error('name_missing')
    if (name.length < 3) throw Error('name_too_short')
    if (name.length > 50) throw Error('name_too_long')
    if (!description) throw Error('description_missing')
    if (description.length < 10) throw Error('description_too_short')
    if (description.length > 100) throw Error('description_too_long')
    if (banner & !isValidUrl(banner)) throw Error('banner_invalid')
    if (!topic) throw Error('topic_missing')

    const lowercaseName = name.toLowerCase()

    const getSpace = await Space.findOne({ lowercaseName })
    if (getSpace) throw Error('space_name_taken')

    const getTopic = await Topic.findById(topic)
    if (!getTopic) throw Error('topic_invalid')

    const newSpace = new Space({
      name,
      description,
      banner,
      manager: req.user.id,
      topicId: topic,
    })

    getTopic.spaces.push(newSpace._id)

    getTopic.save()
    newSpace.save()

    res.status(201).json({ ok: true, topicId: topic })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

export default router
