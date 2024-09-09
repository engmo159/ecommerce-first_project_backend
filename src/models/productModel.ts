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

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number },
    description: { type: String },
    category: { type: String },
    image: { type: String },
    rating: { type: RatingSchema },
    stock: { type: Number },
  },
  { timestamps: true }
)

const productModel = mongoose.model<ProductDocument>('Product', ProductSchema)

export default productModel
