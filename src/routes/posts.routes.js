import { Router } from 'express'
import Post from '../database/models/Post.model'
import { getPost } from '../lib/manageApp'
import { isValidObjectId } from 'mongoose'
const router = Router()

router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params
    if (!isValidObjectId(postId)) throw Error('invalid_post_id')

    res.render('posts/view', {
      post: await getPost(postId, { include_author: true }),
      user: req.user,
    })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

export default router
