import express from 'express'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProductService,
  getLastProduct,
} from '../services/productService'

const router = express.Router()

/* =========================
   GET ALL PRODUCTS
========================= */
router.get('/', async (req, res) => {
  try {
    await getAllProducts(req, res)
  } catch (err) {
    return res.status(500).json({ message: 'something went wrong!' })
  }
})

/* =========================
   GET LAST PRODUCT
========================= */
router.get('/last-product', async (req, res) => {
  try {
    const { data, statusCode } = await getLastProduct()
    return res.status(statusCode).json(data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

/* =========================
   GET PRODUCT BY ID
========================= */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, statusCode } = await getProductById(id)
    return res.status(statusCode).json(data)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
})

/* =========================
   CREATE PRODUCT
========================= */
router.post('/add', async (req, res) => {
  try {
    return await createProduct(req, res)
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong!' })
  }
})

/* =========================
   UPDATE PRODUCT
========================= */
router.put('/edit/:id', async (req, res) => {
  try {
    return await updateProduct(req, res)
  } catch (err) {
    return res.status(500).json({ message: 'something went wrong!' })
  }
})

/* =========================
   DELETE PRODUCT
========================= */
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id

    const remainingProducts = await deleteProductService(productId)

    if (!remainingProducts) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.json({
      message: 'Product deleted successfully',
      products: remainingProducts,
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
})

export default router
