import 'dotenv/config'
import './database/index'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rootRoutes from './routes/root.routes'
import loginRoutes from './routes/login.routes'
import registerRoutes from './routes/register.routes'
import homeRoutes from './routes/home.routes'
import { authenticate } from './middlewares/authenticate.middlewares'
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

export default app
