import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => {
  res.render('home', { user: req.user })
})

export default router
