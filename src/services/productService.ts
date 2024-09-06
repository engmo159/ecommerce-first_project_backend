import { Request, Response } from 'express'
import productModel from '../models/productModel'
import { productArray } from '../data/product'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async () => {
  try {
    const products = await productModel.find({})
    if (!products) {
      return
      // res.status(404).json({ message: 'Products not found' })
    }
    return products
    //  res.json(products)
  } catch (error) {
    return
    //  res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productModel.findById(req.params.id)
    if (product) {
      return res.json(product) // Add return to stop further execution
    } else {
      return res.status(404).json({ message: 'Product not found' }) // Add return
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' }) // Add return
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

    if (product) {
      product.title = title
      product.description = description
      product.price = price
      product.category = category
      product.image = image

      const updatedProduct = await product.save()
      return res.json(updatedProduct) // Add return
    } else {
      return res.status(404).json({ message: 'Product not found' }) // Add return
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' }) // Add return
  }
}

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await productModel.findById(req.params.id)

    if (product) {
      await product.deleteOne()
      return res.json({ message: 'Product removed' })
    } else {
      return res.status(404).json({ message: 'Product not found' })
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' })
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
