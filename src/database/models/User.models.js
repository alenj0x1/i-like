import { Schema, model } from 'mongoose'
import { randomColor } from '../../lib/random'

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
    profile: {
      avatar: {
        type: String,
        default: '',
      },
      banner: {
        type: String,
        default: '',
      },
      about_me: {
        type: String,
        minlength: 1,
        maxlength: 300,
        default: 'hi, welcome to my profile!',
      },
      social_links: {
        type: Array,
        default: [],
      },
      color: {
        type: String,
        default: randomColor('pastel'),
      },
      badges: {
        type: Array,
        default: [{ type: 'account_created' }],
      },
      privacy: {
        hidden_posts_likes: {
          type: Boolean,
          default: false,
        },
        hidden_favorites: {
          type: Boolean,
          default: false,
        },
        hidden_badges: {
          type: Boolean,
          default: false,
        },
        hidden_followers: {
          type: Boolean,
          default: false,
        },
        hidden_following: {
          type: Boolean,
          default: false,
        },
      },
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
