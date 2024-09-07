import express from 'express'
import {
  login,
  register,
  getUserInfo,
  updateUser,
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
    return res.status(500).send('something went wrong!')
  }
})
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const { statusCode, data } = await login({ email, password })
    return res.status(statusCode).send(data)
  } catch (error: any) {
    return res.status(500).send('something went wrong!')
  }
})
router.get('/me', validateJWT, getUserInfo)

router.get('/', async (req, res) => {
  try {
    return res.send('<h1>Welcome to the Homepage</h1>')
  } catch (error) {
    return res.status(500).json({ message: 'Server error' })
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
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

export default router
