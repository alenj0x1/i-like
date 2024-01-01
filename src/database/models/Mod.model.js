import { Schema, model } from 'mongoose'

const Mod = new Schema(
  {
    type: {
      type: String,
      required: true, // "sanction", "support", "report"
    },
    moderators: {
      type: Array,
      required: true, // ["6592651caf60e91a9bce3d18"]
    },
    users_involucred: {
      type: Array,
      required: true, // ["6592651caf60e91a9bce3d19"]
    },
    name: {
      type: String,
      required: true, // "Support: I don't know how to use the channels"
    },
    description: {
      type: String,
      required: true, // "I'm new here and don't quite understand how it works."
    },
    interactions: {
      type: Array,
      default: [], // [{ id: Number, user: User, subject: String, content: String, files: [], timestamp: Date }]
    },
    status: {
      type: String,
      default: 'pending', // 'pending', 'opened', 'closed'
    },
  },
  {
    timestamps: true,
  }
)

export default model('mod', Mod)
