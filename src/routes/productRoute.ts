import {
  deleteProductService,
  getLastProduct,
} from './../services/productService'
import express from 'express'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
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

// In your router file

router.delete('/product/:id', async (req, res) => {
  try {
    const productId = req.params.id

    // Call the service to delete the product and get the updated list
    const remainingProducts = await deleteProductService(productId)

    if (!remainingProducts) {
      // If the product is not found, return a 404 response
      return res.status(404).json({ message: 'Product not found' })
    }

    // Return success message and updated product list
    return res.json({
      message: 'Product removed successfully',
      products: remainingProducts,
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    // Return a server error response
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
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
