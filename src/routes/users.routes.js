import { Router } from 'express'
import User from '../database/models/User.models'
import { filterUserData } from '../lib/filterData'
import { getPosts, getSpaces } from '../lib/manageApp'
import { validateColor } from '../lib/validate'
const router = Router()

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params
    if (!username) username = req.user.username

    const getUser = await User.findOne({ username })
    if (!getUser) throw Error('invalid_user_id')

    res.render('users/view', {
      user: filterUserData(getUser),
      posts: await getPosts({ obj: { include_space: true }, authorId: getUser.id }),
      spaces: await getSpaces({ obj: { include_posts: true }, managerId: getUser.id }),
      color: validateColor(getUser.profile.color),
    })
  } catch (err) {
    res.render('404', { err: err.message })
  }
})

export default router
