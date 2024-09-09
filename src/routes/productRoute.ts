import { getLastProduct } from './../services/productService'
import express from 'express'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const products = await getAllProducts()
    return res.status(200).send(products)
  } catch (err) {
    return res.status(500).send('something went wrong!')
  }
})

router.get('/last-product', async (req, res) => {
  try {
    const { data, statusCode } = await getLastProduct()
    res.status(statusCode).send(data)
  } catch (error) {
    console.error('Error in /last-product route:', error)
    res.status(500).send('Internal Server Error')
  }
})
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const { data, statusCode } = await getProductById(id)
  return res.status(statusCode).send(data)
})
router.put('/edit/:id', async (req, res) => {
  try {
    await updateProduct(req, res)
  } catch (err) {
    return res.status(500).send('something went wrong!')
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const products = await deleteProduct(req, res)
    return res.status(200).send(products)
  } catch (err) {
    return res.status(500).send('something went wrong!')
  }
})
router.post('/add', async (req, res) => {
  try {
    const products = await createProduct(req, res)
    return res.status(200).send(products)
  } catch (err) {
    return res.status(500).send('something went wrong!')
  }
})

export default router
