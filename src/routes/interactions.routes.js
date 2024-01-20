import { Router } from 'express'
import { get, isValidObjectId } from 'mongoose'
import User from '../database/models/User.models'
import Follow from '../database/models/Follow.model'
import { validateColor } from '../lib/validate'
const router = Router()

router.post('/follow/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    if (!isValidObjectId) throw Error('invalid_user_id')

    const getUser = await User.findById(userId)
    if (!getUser) throw Error('invalid_user_id')

    const getFollowed = await Follow.find({ follower: req.user.id, followed: userId })
    if (getFollowed[0]) throw Error('followed_by_user')

    const newFollow = new Follow({
      follower: req.user.id,
      followed: userId,
    })

    await newFollow.save()

    const { suggestedTone, converted } = validateColor({
      color: getUser.profile.color,
      convert: 'hsl',
      useTone: true,
    })

    res.status(201).json({
      color: suggestedTone,
      background: converted,
      followers: getUser.profile.privacy.hidden_followers
        ? 'hidden'
        : (await Follow.find({ followed: getUser.id })).length,
    })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.post('/unfollow/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    if (!isValidObjectId) throw Error('invalid_user_id')

    const getUser = await User.findById(userId)
    if (!getUser) throw Error('invalid_user_id')

    const getFollowed = await Follow.findOneAndDelete({ follower: req.user.id, followed: userId })
    if (!getFollowed) throw Error('no_followed_by_user')

    const { suggestedTone, converted } = validateColor({
      color: getUser.profile.color,
      convert: 'hsl',
      useTone: true,
    })

    res.status(201).json({
      color: suggestedTone,
      background: converted,
      followers: getUser.profile.privacy.hidden_followers
        ? 'hidden'
        : (await Follow.find({ followed: getUser.id })).length,
    })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

export default router
