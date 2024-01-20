import { Schema, model } from 'mongoose'

const Follow = new Schema(
  {
    follower: String,
    followed: String,
  },
  {
    timestamps: true,
  }
)

export default model('follow', Follow)
