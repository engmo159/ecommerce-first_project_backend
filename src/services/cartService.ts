import { orderModel } from './../models/orderModel'
import { ICartItem } from './../models/cartModel'
import { cartModel } from '../models/cartModel'
import productModel from '../models/productModel'
import { IOrderItem } from '../models/orderModel'
import { populate } from 'dotenv'
//create new cart [helper function]
interface CreateCartForUser {
  userId?: string
}
const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId, totalAmount: 0 })
  await cart.save()
  return cart
}
interface GetActiveCartForUser {
  userId?: string
  populateProduct?: boolean
}
export const getActiveCartForUser = async ({
  userId,
  populateProduct,
}: GetActiveCartForUser) => {
  let cart
  if (populateProduct) {
    cart = await cartModel
      .findOne({ userId, status: 'active' })
      .populate('items.product')
  } else {
    cart = await cartModel.findOne({ userId, status: 'active' })
  }

  if (!cart) {
    cart = await createCartForUser({ userId })
  }
  return cart
}
// clear cart
interface ClearCart {
  userId?: string
}

export const clearCart = async ({ userId }: ClearCart) => {
  const cart = await getActiveCartForUser({ userId })
  cart.items = []
  cart.totalAmount = 0
  await cart.save()
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  }
}
// add items to cart
interface AddItemToCart {
  productId: any
  quantity: number
  userId?: string
}

export const addItemToCart = async ({
  productId,
  quantity,
  userId,
}: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId })
  //   does item exist in cart
  const existInCart = cart.items.find(p => p.product.toString() === productId)
  if (existInCart) {
    // return { data: 'item already in cart', statusCode: 400 }
    // If the item exists, increase the quantity by 1
    existInCart.quantity += 1

    // Optionally save the cart if needed (assuming `cart.save()` persists it)
    await cart.save()

    return { data: 'Item quantity increased by 1', statusCode: 200 }
  }
  // fetch product
  const product = await productModel.findById(productId)
  if (!product) {
    return { data: 'product not found', statusCode: 400 }
  }
  // if (product.stock < quantity) {
  //   return { data: 'low stock', statusCode: 400 }
  // }
  cart.items.push({
    product: productId,
    quantity,
    unitPrice: product.price,
  })
  // update total amount for cart
  cart.totalAmount += product.price * quantity
  await cart.save()
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  }
}

// update items in cart

interface UpdateItemInCart {
  productId: any
  quantity: number
  userId?: string
}
export const updateItemInCart = async ({
  productId,
  quantity,
  userId,
}: UpdateItemInCart) => {
  const cart = await getActiveCartForUser({ userId })
  const existInCart = cart.items.find(p => p.product.toString() === productId)
  if (!existInCart) {
    return { data: 'item dose not exist in cart', statusCode: 400 }
  }
  const product = await productModel.findById(productId)
  if (!product) {
    return { data: 'product not found', statusCode: 400 }
  }
  if (product.stock < quantity) {
    return { data: 'low stock', statusCode: 400 }
  }
  const otherCartItems = cart.items.filter(
    p => p.product.toString() !== productId
  )
  let total = calculateTotalCartItems({ cartItems: otherCartItems })

  existInCart.quantity = quantity

  total += existInCart.quantity * existInCart.unitPrice
  cart.totalAmount = total
  await cart.save()
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  }
}

// delete items in cart
interface DeleteItemInCart {
  productId: any
  userId?: string
}

export const deleteItemInCart = async ({
  productId,
  userId,
}: DeleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId })
  const existInCart = cart.items.find(p => p.product.toString() === productId)
  if (!existInCart) {
    return { data: 'item dose not exist in cart', statusCode: 400 }
  }
  const otherCartItems = cart.items.filter(
    p => p.product.toString() !== productId
  )
  const total = calculateTotalCartItems({ cartItems: otherCartItems })
  cart.items = otherCartItems
  cart.totalAmount = total
  await cart.save()
  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  }
}

// calculate total cart items [helper function]
const calculateTotalCartItems = ({ cartItems }: { cartItems: ICartItem[] }) => {
  const total = cartItems.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice
    return sum
  }, 0)
  return total
}

// order checkout
interface Checkout {
  userId: string
  address: string
}

export const checkout = async ({ userId, address }: Checkout) => {
  if (!address) {
    return { data: 'please enter address', statusCode: 400 }
  }
  const cart = await getActiveCartForUser({ userId })
  const orderItems: IOrderItem[] = []
  // loop cart items and create order
  for (const item of cart.items) {
    const product = await productModel.findById(item.product)
    if (!product) {
      return { data: 'product not found', statusCode: 400 }
    }
    const orderItem: IOrderItem = {
      productTitle: product.title,
      productImage: product.image,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }
    orderItems.push(orderItem)
  }
  const order = await orderModel.create({
    orderItems,
    userId,
    total: cart.totalAmount,
    address,
  })
  await order.save()
  // update the cart status to be completed
  cart.status = 'completed'
  await cart.save()
  return { data: { order }, statusCode: 200 }
}
