import mongoose, { Schema, Document } from 'mongoose'

interface Rating {
  rate: number
  count: number
}

export interface ProductDocument extends Document {
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: Rating
  stock: number
}

const RatingSchema: Schema = new Schema({
  rate: { type: Number, required: true },
  count: { type: Number, required: true },
})

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: RatingSchema, required: true },
  stock: { type: Number },
})

const productModel = mongoose.model<ProductDocument>('Product', ProductSchema)

export default productModel
