import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoute from './routes/userRoute'
import productRoute from './routes/productRoute'
import { seedInitialProducts } from './services/productService'
import cartRoute from './routes/cartRoute'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGODB_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('cant connect', err))
// seed the products to database
seedInitialProducts()

app.use('/user', userRoute)
app.use('/product', productRoute)
app.use('/cart', cartRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
