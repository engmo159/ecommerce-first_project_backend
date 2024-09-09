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
  const { title, description, price, category, image, rating, stock } = req.body

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
    stock,
  })

  try {
    // Save the newly created product
    await product.save()

    // Fetch all products after adding the new one
    const allProducts = await productModel.find()

    // Return the updated product list
    return res.status(201).json({
      message: 'Product created successfully',
      products: allProducts,
    })
  } catch (error) {
    console.error('Error creating product:', error)

    return res.status(500).json({ message: 'Server error' })
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
// In productService.ts

export const deleteProductService = async (productId: string) => {
  try {
    // Find the product by ID
    const product = await productModel.findById(productId)

    // If the product does not exist, return null
    if (!product) {
      return null
    }

    // Delete the product
    await productModel.deleteOne({ _id: productId })

    // Fetch all remaining products
    const remainingProducts = await productModel.find()

    // Return the updated list of products
    return remainingProducts
  } catch (error: any) {
    throw new Error(`Error deleting product: ${error.message}`)
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
