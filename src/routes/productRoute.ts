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

// DELETE route for deleting a product and returning updated products
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id

    // Call the service to delete the product and get the updated list
    const remainingProducts = await deleteProductService(productId)

    // If the product is not found, return 404
    if (!remainingProducts) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Return success message and updated product list
    return res.json({
      message: 'Product deleted successfully',
      products: remainingProducts,
    })
  } catch (error: any) {
    // Log and return server error
    console.error('Error deleting product:', error)
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

router.post('/add', async (req, res) => {
  try {
    // Directly call createProduct which handles the response itself
    await createProduct(req, res)
  } catch (err) {
    return res.status(500).send('Something went wrong!')
  }
})

export default router
