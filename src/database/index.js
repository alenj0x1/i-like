import { connect } from 'mongoose'

connect(process.env.MONGODB_URI)
  .then(() => console.log('database connected correctly'))
  .catch((err) => console.log(`database connection error: ${err}`))
