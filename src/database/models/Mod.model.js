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
    user: {
      type: String,
      required: true, // "6592651caf60e91a9bce3d19"
    },
    subject: {
      type: String,
      required: true, // "Support: I don't know how to use the channels"
    },
    content: {
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
    sanction_type: {
      type: String, // 'muted', 'banned'
    },
    sanction_time: {
      type: Number, // 1000, 3600000
    },
  },
  {
    timestamps: true,
  }
)

export default model('mod', Mod)
