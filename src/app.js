import express from 'express'
import morgan from 'morgan'
import 'dotenv/config'
const SERVER_PORT = process.env.SERVER_PORT || 3001

const app = express()

// App configuration
app.set('port', SERVER_PORT)
app.use(morgan('dev'))

export default app
