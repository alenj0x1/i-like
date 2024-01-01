import { connect } from 'mongoose'
import User from './models/User.models'
import { hashPassword } from '../lib/managePassword'

connect(process.env.MONGODB_URI)
  .then(async () => {
    if ((await User.estimatedDocumentCount()) === 0) {
      const admin = new User({
        username: process.env.ADMIN_USER_USERNAME,
        display_name: process.env.ADMIN_USER_DISPLAY_NAME,
        password: hashPassword(process.env.ADMIN_USER_PASSWORD),
        roles: ['admin'],
      })
      await admin.save()

      console.log('app started for the first time, admin user created')
    }

    console.log('database connected correctly')
  })
  .catch((err) => console.log(`database connection error: ${err}`))
