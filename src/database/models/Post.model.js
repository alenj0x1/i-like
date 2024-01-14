import { Schema, model } from 'mongoose'

const Post = new Schema(
  {
    title: {
      type: String,
      minLength: 3,
      maxLength: 50,
      unique: true,
      required: true,
    },
    content: {
      type: String,
      minLength: 30,
      maxLength: 4000,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    banner: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      required: true,
    },
    spaceId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default model('post', Post)
