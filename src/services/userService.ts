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
export const updateUser = async (req: UserRequest, res: Response) => {
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
    // Find the user by ID, excluding the password field
    const user = await userModel.findById(req.user._id).select('-password')

    if (!user) {
      // Return early if user is not found
      throw new Error('User not found')
    }

    // Update user fields only if they are provided in the request body
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (email) user.email = email
    if (city) user.city = city
    if (gender) user.gender = gender
    if (phone) user.phone = phone
    if (image) user.image = image

    // Update password if a new one is provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword
    }

    // Save the updated user to the database
    const updatedUser = await user.save()

    // Return the updated user object
    return updatedUser
  } catch (error: any) {
    // Handle any server errors
    throw new Error(error.message || 'Server error')
  }
}

// get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Find all users, excluding passwords for security
    const users = await userModel.find().select('-password')

    // If no users are found, return a 404
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' })
    }

    // Return the list of users
    res.status(200).json(users)
  } catch (error: any) {
    // Handle any server errors
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
// get last registered user
export const getLastRegisteredUser = async () => {
  try {
    const user = await userModel.findOne().sort({ createdAt: -1 })
    if (!user) {
      return { data: 'No users found', statusCode: 404 }
    }
    return { data: user, statusCode: 200 }
  } catch (error) {
    return { data: 'Server error', statusCode: 500 }
  }
}

// change user role
export const changeUserRole = async (req: Request, res: Response) => {
  const userId = req.params.id

  try {
    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Toggle role between 'admin' and 'user'
    user.role = user.role === 'admin' ? 'user' : 'admin'
    await user.save()

    // Fetch all users after updating the role
    const allUsers = await userModel.find()

    return res
      .status(200)
      .json({ message: 'User role updated successfully', users: allUsers })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

// get user by id
export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id

  try {
    // Find user by ID
    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Return user details
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

// Controller function to update user info by id
export const updateUserById = async (req: Request, res: Response) => {
  const userId = req.params.id // Get user id from params
  const updatedData = req.body // Get updated data from the request body

  try {
    // Find user by ID and update
    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { $set: updatedData }, // Set updated fields
        { new: true, runValidators: true } // Options to return the new document and validate updates
      )
      .select('-password') // Exclude password from returned data

    // If user not found
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Send updated user data as a response
    return res.status(200).json(updatedUser)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}
