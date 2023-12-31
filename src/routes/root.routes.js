import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.middlewares'
const router = Router()

router.get('/', authenticate, (_req, res) => {
  res.render('root')
})

export default router
