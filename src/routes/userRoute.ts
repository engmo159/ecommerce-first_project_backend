import express from 'express'
import {
  login,
  register,
  getUserInfo,
  updateUser,
  getAllUsers,
  getLastRegisteredUser,
} from '../services/userService'
import validateJWT from '../middlewares/validateJWT'

const router = express.Router()
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, city, gender, phone, password, image } =
      req.body
    const { statusCode, data } = await register({
      firstName,
      lastName,
      email,
      city,
      gender,
      phone,
      password,
      image,
    })
    return res.status(statusCode).send(data)
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Something went wrong!', error: error.message })
  }
})
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const { statusCode, data } = await login({ email, password })
    return res.status(statusCode).send(data)
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Something went wrong!', error: error.message })
  }
})
router.get('/me', validateJWT, getUserInfo)

router.get('/', async (req, res) => {
  try {
    return res.send('<h1>Welcome to the Homepage</h1>')
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Something went wrong!', error: error.message })
  }
})

router.put('/edit', validateJWT, async (req, res) => {
  try {
    // Call updateUser and receive the result
    const updatedUser = await updateUser(req, res)

    // Check if updatedUser is returned correctly
    if (updatedUser) {
      return res
        .status(200)
        .json({ message: 'User updated successfully', user: updatedUser })
    } else {
      return res.status(500).json({ message: 'Something went wrong!' })
    }
  } catch (error: any) {
    return res.status(500)
    return res
      .status(500)
      .json({ message: 'Something went wrong!', error: error.message })
  }
})

// Get all users route - protected with JWT validation middleware
router.get('/users', validateJWT, getAllUsers)
export default router

router.get('/last-user', async (req, res) => {
  const { data, statusCode } = await getLastRegisteredUser()
  return res.status(statusCode).send(data)
})
