import { Router } from 'express'
import User from '../database/models/User.models'
import { isValidUrl } from '../lib/validate'
import { filterUserData } from '../lib/filterData'
const router = Router()

/**  View **/
router.get('/', async (req, res) => {
  try {
    res.render('settings.pug', {
      user: req.user,
    })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

/** Update settings: Appearance **/
router.post('/updateAppr', async (req, res) => {
  try {
    const { display_name, username, about_me, banner_url, avatar_url, color } = req.body
    console.log(req.body)
    if (display_name && display_name.length < 2) throw Error('display_name_too_short')
    if (display_name && display_name.length > 56) throw Error('display_name_too_long')
    if (username && display_name.length < 3) throw Error('username_too_short')
    if (username && display_name.length > 28) throw Error('username_too_long')
    if (banner_url && !isValidUrl(banner_url)) throw Error('banner_invalid')
    if (avatar_url && !isValidUrl(avatar_url)) throw Error('avatar_invalid')
    if (about_me && about_me.length > 300) throw Error('about_me_too_long')

    const getUser = await User.findByIdAndUpdate(req.user.id, {
      display_name: display_name.length ? display_name : req.user.display_name,
      username: username.length ? username : req.user.username,
      profile: {
        about_me: about_me.length ? about_me : req.user.profile.about_me,
        banner: banner_url.length ? banner_url : req.user.profile.banner,
        avatar: avatar_url.length ? avatar_url : req.user.profile.avatar,
        color: color !== '#000000' ? color : req.user.profile.color,
      },
    })

    await getUser.save()

    res.status(200).json({ ok: true })
  } catch (err) {
    console.log(err)
    res.status(404).json({ err: err.message })
  }
})

export default router
