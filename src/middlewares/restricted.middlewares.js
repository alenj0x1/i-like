export function restricted(req, res, next) {
  if (!req.user.roles.includes('admin')) return res.redirect('/404')

  next()
}
