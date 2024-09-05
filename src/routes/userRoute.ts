import express from 'express'
import { login, register, getUserInfo } from '../services/userService'
import validateJWT from '../middlewares/validateJWT'

const router = express.Router()
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const { statusCode, data } = await register({ name, email, password })
    res.status(statusCode).send(data)
  } catch (error: any) {
    res.status(500).send('something went wrong!')
  }
})
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const { statusCode, data } = await login({ email, password })
    res.status(statusCode).send(data)
  } catch (error: any) {
    res.status(500).send('something went wrong!')
  }
})
router.get('/me', validateJWT, getUserInfo)

router.get('/', async (req, res) => {
  try {
    res.send('<h1>Welcome to the Homepage</h1>')
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})
export default router
