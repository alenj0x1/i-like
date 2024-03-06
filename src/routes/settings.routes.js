import { Router } from 'express'
import User from '../database/models/User.models'
import { isValidUrl, validateColor } from '../lib/validate'
import { hashPassword, comparePassword } from '../lib/managePassword'
const router = Router()

/**  View **/
router.get('/', async (req, res) => {
  try {
    res.render('settings.pug', {
      user: req.user,
      color: validateColor({ color: req.user.profile.color, convert: 'hsl', useTone: true }),
    })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

/** Update settings: Appearance **/
router.post('/updateAppr', async (req, res) => {
  try {
    const { display_name, username, about_me, banner_url, avatar_url, color } = req.body
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
      'profile.about_me': about_me.length ? about_me : req.user.profile.about_me,
      'profile.banner': banner_url.length ? banner_url : req.user.profile.banner,
      'profile.avatar': avatar_url.length ? avatar_url : req.user.profile.avatar,
      'profile.color': color !== '#000000' ? color : req.user.profile.color,
    })

    await getUser.save()
    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.post('/updatePriv', async (req, res) => {
  try {
    const { hidden_posts_likes, hidden_favorites, hidden_badges, hidden_followers, hidden_following } = req.body

    const getUser = await User.findByIdAndUpdate(req.user.id, {
      'profile.privacy': {
        hidden_posts_likes,
        hidden_favorites,
        hidden_badges,
        hidden_followers,
        hidden_following,
      },
    })

    await getUser.save()
    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
})

router.post('/changePass', async (req, res) => {
  try {
    const { current_password, new_password, new_password_confirm, password_hint } = req.body
    if (current_password.length < 8) throw Error('current_password_invalid')
    if (new_password.length < 8) throw Error('new_password_invalid')
    if (new_password_confirm.length < 8) throw Error('new_password_invalid')
    if (new_password !== new_password_confirm) throw Error('new_password_not_match')

    const getUser = await User.findById(req.user.id)

    if (!comparePassword(current_password, getUser.password)) throw Error('incorrect_password')

    getUser.password = hashPassword(new_password)
    getUser.password_hint = password_hint

    await getUser.save()
    res.status(200).json({ ok: true })
  } catch (err) {
    console.log(err)
    res.status(404).json({ err: err.message })
  }
})

export default router
