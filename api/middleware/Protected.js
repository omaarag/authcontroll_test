import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const Protected = async (req, res, next) => {
  const { authorization } = req.headers
  let token
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      token = authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id).select('id name email role')
      if (!user) {
        throw new Error()
      }
      user.jwt = token
      req.user = user
      return next()
    } catch (e) {
      const error = new Error('Authentication error')
      error.name = 'UnauthorizedError'
      return next(error)
    }
  }
  if (!token) {
    const error = new Error('Authentication error')
    error.name = 'UnauthorizedError'
    return next(error)
  }
}

export default Protected
