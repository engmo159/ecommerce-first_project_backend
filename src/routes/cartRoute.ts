import { ExtendRequest } from './../types/extendedRequest'
import express, { Request, Response } from 'express'
import {
  addItemToCart,
  checkout,
  clearCart,
  deleteItemInCart,
  getActiveCartForUser,
  updateItemInCart,
} from '../services/cartService'
import validateJWT from '../middlewares/validateJWT'

const router = express.Router()

router.get('/', async (req: ExtendRequest, res: Response) => {
  try {
    const userId = req?.user?._id
    const cart = await getActiveCartForUser({ userId, populateProduct: true })
    return res.status(200).send(cart)
  } catch (err) {
    return res.status(500).send('something went wrong!')
  }
})

router.post('/items', async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id
    const { productId, quantity } = req.body
    const response = await addItemToCart({ userId, productId, quantity })
    return res.status(response.statusCode).send(response.data)
  } catch (err) {
    return res.status(500).send('something went wrong!')
  }
})
router.put('/items/edit', async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id
    const { productId, quantity } = req.body
    const response = await updateItemInCart({ userId, productId, quantity })
    return res.status(response.statusCode).send(response.data)
  } catch (err) {
    return res.status(500).send('something went wrong!')
  }
})
router.delete(
  '/items/delete/:productId',

  async (req: ExtendRequest, res) => {
    try {
      const userId = req?.user?._id
      const { productId } = req.params
      const response = await deleteItemInCart({ userId, productId })
      return res.status(response.statusCode).send(response.data)
    } catch (err) {
      return res.status(500).send('something went wrong!')
    }
  }
)
// clear all cart items
router.delete('/', async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id
    const response = await clearCart({ userId })
    return res.status(response.statusCode).send(response.data)
  } catch (err) {
    return res.status(500).send('something went wrong!')
  }
})
// checkout
router.post('/checkout', validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id
    const { address } = req.body
    const response = await checkout({ userId, address })
    return res.status(response.statusCode).send(response.data)
  } catch (err) {
    return res.status(500).send('something went wrong!')
  }
})

export default router
