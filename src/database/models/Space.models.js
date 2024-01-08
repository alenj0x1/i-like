import { Schema, model } from 'mongoose'

const Space = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 50,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      minLength: 10,
      maxLength: 100,
      required: true,
    },
    banner: {
      type: String,
      default: '',
    },
    manager: {
      type: String,
      required: true,
    },
    topicId: {
      type: String,
      required: true,
    },
    posts: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

export default model('space', Space)
