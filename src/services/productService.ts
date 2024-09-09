import { Request, Response } from 'express'
import productModel from '../models/productModel'
import { productArray } from '../data/product'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async () => {
  try {
    const products = await productModel.find({})
    return products
  } catch (error) {
    throw new Error('Server error')
  }
}

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (id: string) => {
  try {
    const product = await productModel.findById(id)
    if (product) {
      return { data: product, statusCode: 200 }
    } else {
      return { data: { message: 'Product not found' }, statusCode: 404 }
    }
  } catch (error) {
    return { data: { message: 'Server error' }, statusCode: 500 }
  }
}

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
  const { title, description, price, category, image, rating } = req.body

  const product = new productModel({
    title,
    description,
    price,
    category,
    image,
    rating: rating || {
      rate: 0,
      count: 0,
    },
    stock: 10,
  })

  try {
    const createdProduct = await product.save()
    return res.status(201).json(createdProduct) // Add return
  } catch (error) {
    return res.status(500).json({ message: 'Server error' }) // Add return
  }
}

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  const { title, description, price, category, image } = req.body

  try {
    const product = await productModel.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' }) // Return if not found
    }

    // Update product details
    product.title = title
    product.description = description
    product.price = price
    product.category = category
    product.image = image

    // Save the updated product
    const updatedProduct = await product.save()
    return res.json(updatedProduct) // Return the updated product
  } catch (error) {
    console.error('Error updating product:', error) // Log the error for debugging
    return res.status(500).json({ message: 'Server error' }) // Send error response
  }
}

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    // Find the product by ID
    const product = await productModel.findById(req.params.id)

    if (!product) {
      // If the product is not found, return a 404 error
      return res.status(404).json({ message: 'Product not found' })
    }

    // Delete the product
    await product.deleteOne()

    // Fetch the remaining products after deletion
    const remainingProducts = await productModel.find()

    // Return the success message along with the updated product list
    return res.json({
      message: 'Product removed successfully',
      data: remainingProducts,
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)

    // Return server error
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
}

// Insert products to database
export const getProducts = async () => {
  return await productModel.find()
}

export const seedInitialProducts = async () => {
  try {
    const existingProducts = await getProducts()
    if (existingProducts.length === 0) {
      await productModel.insertMany(productArray)
    }
  } catch (error) {
    console.error('can not seed product database', error)
  }
}

// get last product added
export const getLastProduct = async () => {
  try {
    const product = await productModel.findOne().sort({ createdAt: -1 })
    if (!product) {
      return { data: 'No products found', statusCode: 404 }
    }
    return { data: product, statusCode: 200 }
  } catch (error) {
    return { data: 'Server error', statusCode: 500 }
  }
}
