import { Schema, model } from 'mongoose'

const Topic = new Schema(
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
    spaces: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

export default model('topic', Topic)
