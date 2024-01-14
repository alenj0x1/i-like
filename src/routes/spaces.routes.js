import { Router } from 'express'
import { getSpaces, getTopics } from '../lib/manageApp'
import { isValidUrl } from '../lib/validate'
import Space from '../database/models/Space.models'
import Topic from '../database/models/Topic.model'
import Post from '../database/models/Post.model'
import { isValidObjectId } from 'mongoose'
import { filterSpaceData } from '../lib/filterData'
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

router.get('/:spaceId', async (req, res) => {
  try {
    const { spaceId } = req.params

    const getSpace = await Space.findById(spaceId)
    if (!isValidObjectId(spaceId) || !getSpace) throw Error('invalid_space_id')

    res.render('spaces/view', {
      space: await filterSpaceData(getSpace, {
        include_manager: true,
        include_topic: true,
      }),
      user: req.user,
    })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.get('/:spaceId/redactPost', async (req, res) => {
  try {
    const { spaceId } = req.params

    const getSpace = await Space.findById(spaceId)
    if (!isValidObjectId(spaceId) || !getSpace) throw Error('invalid_space_id')

    res.render('spaces/redactPost', {
      space: await filterSpaceData(getSpace, {
        include_manager: true,
        include_topic: true,
      }),
      user: req.user,
    })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.post('/:spaceId/redactPost', async (req, res) => {
  try {
    const { spaceId } = req.params
    const { title, content, banner, tags } = req.body
    if (!title) throw Error('title_missing')
    if (title.length < 3) throw Error('title_too_short')
    if (title.length > 50) throw Error('title_too_long')
    if (!content) throw Error('content_missing')
    if (content.length < 30) throw Error('content_too_short')
    if (content.length > 4000) throw Error('content_too_long')
    if (!isValidUrl(banner)) throw Error('invalid_banner')

    const tagsParsed = tags.split(',')

    const getSpace = await Space.findById(spaceId)
    if (!isValidObjectId(spaceId) || !getSpace) throw Error('invalid_space_id')

    const lowercaseTitle = title.toLowerCase()

    const getPost = await Post.findOne({ title: lowercaseTitle })
    if (!getPost) throw Error('post_title_taken')

    const newPost = new Post({
      title,
      content,
      banner,
      author: req.user.id,
      tags: tagsParsed,
      spaceId,
    })

    getSpace.posts.push(newPost._id)

    getSpace.save()
    newPost.save()

    res.status(201).json({ ok: true, spaceId })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

export default router
