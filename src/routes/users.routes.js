import { Router } from 'express'
import User from '../database/models/User.models'
import { filterUserData } from '../lib/filterData'
import { getPosts, getSpaces } from '../lib/manageApp'
import { validateColor } from '../lib/validate'
import Follow from '../database/models/Follow.model'
const router = Router()

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params
    if (!username) username = req.user.username

    const getUser = await User.findOne({ username })
    if (!getUser) throw Error('invalid_user_id')

    const followedByUser = await Follow.find({ follower: req.user.id, followed: getUser.id })

    res.render('users/view', {
      user: filterUserData(getUser),
      posts: await getPosts({ obj: { include_space: true }, authorId: getUser.id }),
      spaces: await getSpaces({ obj: { include_posts: true }, managerId: getUser.id }),
      color: validateColor({ color: getUser.profile.color, convert: 'hsl', useTone: true }),
      viewer: req.user,
      followedByUser: followedByUser[0] ? 1 : 0,
      followers: (await Follow.find({ followed: getUser.id })).length,
      following: (await Follow.find({ follower: getUser.id })).length,
    })
  } catch (err) {
    res.render('404', { err: err.message })
  }
})

export default router
