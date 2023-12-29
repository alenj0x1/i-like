import { Router } from 'express'
const router = Router()

router.get('/register', (_req, res) => {
  res.render('register')
})

export default router
