import 'dotenv/config'
import './database/index'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rootRoutes from './routes/root.routes'
import loginRoutes from './routes/login.routes'
import registerRoutes from './routes/register.routes'
import homeRoutes from './routes/home.routes'
import manageRoutes from './routes/manage.routes'
import spacesRoutes from './routes/spaces.routes'
import topicsRoutes from './routes/topics.routes'
import postRoutes from './routes/posts.routes'
import settingsRoutes from './routes/settings.routes'
import usersRoutes from './routes/users.routes'
import interactionsRoutes from './routes/interactions.routes'
import { authenticate } from './middlewares/authenticate.middlewares'
import { restricted } from './middlewares/restricted.middlewares'
const SERVER_PORT = process.env.SERVER_PORT || 3001

const app = express()

// App configuration
app.use(express.static('public'))

app.set('port', SERVER_PORT)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Pug engine
app.set('views', 'public/views')
app.set('view engine', 'pug')

// Routes
app.use('/', rootRoutes)
app.use('/login', authenticate, loginRoutes)
app.use('/register', authenticate, registerRoutes)
app.use('/home', authenticate, homeRoutes)
app.use('/spaces', authenticate, spacesRoutes)
app.use('/topics', authenticate, topicsRoutes)
app.use('/posts', authenticate, postRoutes)
app.use('/settings', authenticate, settingsRoutes)
app.use('/users', authenticate, usersRoutes)
app.use('/interactions', authenticate, interactionsRoutes)

app.get('/me', authenticate, (req, res) => {
  res.redirect(`/users/${req.user.username}`)
})

app.get('/logout', authenticate, (req, res) => {
  if (req.cookies.token) {
    res.clearCookie('token')
    res.redirect('/')
  }
})

app.use('/manage', [authenticate, restricted], manageRoutes)

app.all('*', (_req, res) => {
  res.render('404')
})

export default app
