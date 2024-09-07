import userModel from '../models/userModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

// register

interface RegisterParams {
  firstName: string
  lastName?: string
  email: string
  password: string
  city?: string
  gender?: string
  phone?: string
  image?: string
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
  city,
  gender,
  phone,
  image,
}: RegisterParams) => {
  const findUser = await userModel.findOne({ email })
  if (findUser) {
    return { data: 'User already exists!', statusCode: 400 }
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    city,
    gender,
    phone,
    image,
    role: 'user',
  })
  await newUser.save()
  return {
    data: generateJWT({
      firstName,
      lastName,
      email,
      city,
      gender,
      phone,
      image,
      role: 'user',
    }),
    statusCode: 200,
  }
}

// login
interface LoginParams {
  email: string
  password: string
}
export const login = async ({ email, password }: LoginParams) => {
  const findUser = await userModel.findOne({ email })
  if (!findUser) {
    return { data: 'incorrect email or password!', statusCode: 400 }
  }
  const passwordMatch = await bcrypt.compare(password, findUser.password)
  if (passwordMatch) {
    return {
      data: generateJWT({
        email,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        city: findUser.city,
        gender: findUser.gender,
        phone: findUser.phone,
        image: findUser.image,
        role: findUser.role,
      }),
      statusCode: 200,
    }
  }
  return { data: 'incorrect email or password!', statusCode: 400 }
}
// jwt
const generateJWT = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET || '')
}

// find single user
interface UserRequest extends Request {
  user?: any
}
export const getUserInfo = async (req: UserRequest, res: Response) => {
  try {
    const user = await userModel.findById(req.user._id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// update user data
interface UpdateUserParams {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  city?: string
  gender?: string
  phone?: string
  image?: string
}

// Update user function
export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id // Assuming you're passing the user ID as a URL parameter
  const {
    firstName,
    lastName,
    email,
    password,
    city,
    gender,
    phone,
    image,
  }: UpdateUserParams = req.body

  try {
    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update the user's fields if provided in the request body
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (email) user.email = email
    if (city) user.city = city
    if (gender) user.gender = gender
    if (phone) user.phone = phone
    if (image) user.image = image

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword
    }

    const updatedUser = await user.save()

    return res.json(updatedUser) // Add return
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}
