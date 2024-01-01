import { Schema, model } from 'mongoose'

const User = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    display_name: {
      type: String,
      required: true,
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
      default: [],
    },
    roles: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default model('user', User)
