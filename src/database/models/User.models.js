import { Schema, model } from 'mongoose'

const User = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minLength: 3,
      maxLength: 28,
    },
    display_name: {
      type: String,
      required: true,
      maxLength: 56,
    },
    password: {
      type: String,
      required: true,
    },
    password_hint: {
      type: String,
    },
    like: {
      type: Array,
      default: [], // Coming soon
    },
    roles: {
      type: Array,
      required: true, // "admin", "mod", 'support", "user"
    },
    status: {
      type: Boolean,
      default: true, // "true: connected", "false: disconnected"
    },
    account_status: {
      type: String,
      default: 'good', // "good", ,"muted', "banned"
    },
  },
  {
    timestamps: true,
  }
)

export default model('user', User)
