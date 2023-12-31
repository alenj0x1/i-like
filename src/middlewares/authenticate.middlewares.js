import { validateToken } from '../lib/manageToken'

export function authenticate(req, res, next) {
  const TOKEN = req.cookies.token
  const BASE_URL = req._parsedUrl.href
  const LOW_LEVEL_ROUTES = ['/', '/login', '/register']

  if (!TOKEN && !LOW_LEVEL_ROUTES.includes(BASE_URL)) {
    res.redirect('/login')
    return
  }

  const checkToken = validateToken(TOKEN)
  if (!checkToken.result) {
    res.clearCookie('token')
    return next()
  }

  if (LOW_LEVEL_ROUTES.includes(BASE_URL)) {
    req.user = checkToken.data
    res.redirect('/home')
    return
  }

  req.user = checkToken.data
  next()
}
