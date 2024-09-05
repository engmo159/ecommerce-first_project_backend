import { Request, Response } from 'express'
import productModel from '../models/productModel'
import { productArray } from '../data/product'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.find({})
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productModel.findById(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock, thumbnail } = req.body

  const product = new productModel({
    name,
    description,
    price,
    stock,
    thumbnail,
    rating: 0,
    numReviews: 0,
  })

  try {
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock, thumbnail } = req.body

  try {
    const product = await productModel.findById(req.params.id)

    if (product) {
      product.name = name
      product.description = description
      product.price = price

      product.stock = stock
      product.thumbnail = thumbnail

      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404).json({ message: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
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
      res.json({ message: 'Product removed' })
    } else {
      res.status(404).json({ message: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

//insert products to database
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
