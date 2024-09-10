import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  city: string
  gender: string
  phone: string
  image: string
  role: string
}
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    gender: {
      type: String,
    },
    phone: {
      type: String,
    },
    image: {
      type: String,
    },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true }
)

const userModel = mongoose.model<IUser>('User', userSchema)

export default userModel
