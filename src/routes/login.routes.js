import { Router } from 'express'
const router = Router()

router.get('/login', (_req, res) => {
  res.render('login')
})

export default router
