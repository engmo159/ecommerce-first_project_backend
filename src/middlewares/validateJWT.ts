import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel'
import { ExtendRequest } from '../types/extendedRequest'

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.get('Authorization')
  if (!authorizationHeader) {
    res.status(403).send('authorization header is required')
    return
  }
  const token = authorizationHeader.split(' ')[1]
  if (!token) {
    res.status(403).send('Bearer token is required')
    return
  }
  jwt.verify(token, process.env.JWT_SECRET || '', async (err, payload) => {
    if (err) {
      res.status(403).send('Invalid token')
      return
    }
    if (!payload) {
      res.status(403).send('invalid token payload')
      return
    }
    const userPayload = payload as {
      email: string
      name: string
      role: string
    }
    // fetch user from database based on payload
    const user = await userModel.findOne({ email: userPayload.email })
    req.user = user
    next()
  })
}

export default validateJWT
