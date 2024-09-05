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
    const products = await getAllProducts(req, res)
    res.status(200).send(products)
  } catch (err) {
    res.status(500).send('something went wrong!')
  }
})
router.get('/:id', async (req, res) => {
  try {
    const products = await getProductById(req, res)
    res.status(200).send(products)
  } catch (err) {
    res.status(500).send('something went wrong!')
  }
})
router.put('/edit/:id', async (req, res) => {
  try {
    const products = await updateProduct(req, res)
    res.status(200).send(products)
  } catch (err) {
    res.status(500).send('something went wrong!')
  }
})
router.delete('/:id', async (req, res) => {
  try {
    const products = await deleteProduct(req, res)
    res.status(200).send(products)
  } catch (err) {
    res.status(500).send('something went wrong!')
  }
})
router.post('/add', async (req, res) => {
  try {
    const products = await createProduct(req, res)
    res.status(200).send(products)
  } catch (err) {
    res.status(500).send('something went wrong!')
  }
})
export default router
