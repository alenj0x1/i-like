import 'dotenv/config'
import './database/index'
import express from 'express'
import morgan from 'morgan'
import homeRoutes from './routes/home.routes'
import loginRoutes from './routes/login.routes'
const SERVER_PORT = process.env.SERVER_PORT || 3001

const app = express()

// App configuration
app.use(express.static('public'))

app.set('port', SERVER_PORT)
app.use(morgan('dev'))

// Pug engine
app.set('views', 'public/views')
app.set('view engine', 'pug')

// Routes
app.use(homeRoutes)
app.use(loginRoutes)

export default app
