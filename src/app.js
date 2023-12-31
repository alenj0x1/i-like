import 'dotenv/config'
import './database/index'
import express from 'express'
import morgan from 'morgan'
import rootRoutes from './routes/root.routes'
import loginRoutes from './routes/login.routes'
import registerRoutes from './routes/register.routes'
const SERVER_PORT = process.env.SERVER_PORT || 3001

const app = express()

// App configuration
app.use(express.static('public'))

app.set('port', SERVER_PORT)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Pug engine
app.set('views', 'public/views')
app.set('view engine', 'pug')

// Routes
app.use(rootRoutes)
app.use(loginRoutes)
app.use(registerRoutes)

export default app
