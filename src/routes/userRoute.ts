import express from 'express'
import {
  login,
  register,
  getUserInfo,
  updateUser,
  getAllUsers,
  getLastRegisteredUser,
  changeUserRole,
  getUserById,
  updateUserById,
  deleteUserById,
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
    const updatedUser = await updateUser(req, res)

    if (updatedUser) {
      return res
        .status(200)
        .json({ message: 'User updated successfully', user: updatedUser })
    } else {
      return res.status(500).json({ message: 'Something went wrong!' })
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Something went wrong!', error: error.message })
  }
})

// Get all users route
router.get('/users', validateJWT, getAllUsers)

router.get('/last-user', async (req, res) => {
  const { data, statusCode } = await getLastRegisteredUser()
  return res.status(statusCode).send(data)
})

// Route to change user role
router.put('/change-role/:id', validateJWT, changeUserRole)

// Route to get user information by ID
router.get('/:id', getUserById)

// Route to update user info by id
router.put('/update/:id', updateUserById)

router.delete('/delete-user/:id', deleteUserById)
export default router
