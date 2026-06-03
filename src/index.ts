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

// Test Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running successfully',
    mongoConnected: mongoose.connection.readyState === 1,
    mongoState: mongoose.connection.readyState,
  })
})

console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI)

mongoose
  .connect(process.env.MONGODB_URI || '')
  .then(() => {
    console.log('✅ MongoDB connected successfully')
    seedInitialProducts()
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed')
    console.error(err)
  })

app.use('/user', userRoute)
app.use('/product', productRoute)
app.use('/cart', cartRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

// import express from 'express'
// import mongoose from 'mongoose'
// import dotenv from 'dotenv'
// import cors from 'cors'
// import userRoute from './routes/userRoute'
// import productRoute from './routes/productRoute'
// import { seedInitialProducts } from './services/productService'
// import cartRoute from './routes/cartRoute'

// dotenv.config()
// const app = express()
// app.use(cors())
// app.use(express.json())

// mongoose
//   .connect(process.env.MONGODB_URI || '')
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log('cant connect', err))
// // seed the products to database
// seedInitialProducts()

// app.use('/user', userRoute)
// app.use('/product', productRoute)
// app.use('/cart', cartRoute)

// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
