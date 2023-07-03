import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import crypto from 'crypto'
import { emailRegister } from '../helpers/Email.js'

export const Auth = (req, res, next) => {
  const { user } = req
  res.json(user)
}

export const Login = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    const error = new Error('Missing credentials')
    error.name = 'UnauthorizedError'
    return next(error)
  }

  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error('User not found')
    error.name = 'UnauthorizedError'
    return next(error)
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    const error = new Error('Wrong password')
    error.name = 'UnauthorizedError'
    return next(error)
  }

  if (!user.active) {
    const error = new Error('Account not confirmed')
    error.name = 'UnauthorizedError'
    return next(error)
  }

  res.status(200).json({
    ok: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      jwt: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    }
  })
}

export const Register = async (req, res, next) => {
  const { name, email, password, password2 } = req.body

  if (!name || !email || !password || !password2) {
    const error = new Error('Missing data')
    error.name = 'ValidationError'
    return next(error)
  }

  const validEmail = email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  if (!validEmail) {
    const error = new Error('Invalid Email')
    error.name = 'ValidationError'
    return next(error)
  }

  if (password !== password2) {
    const error = new Error('Passwords do not match')
    error.name = 'ValidationError'
    return next(error)
  }

  const exist = await User.findOne({ email })
  if (exist) {
    const error = new Error('Email already registered')
    error.name = 'ForbiddenError'
    return next(error)
  }

  const token = crypto.randomBytes(20).toString('hex')
  const newUser = new User({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    token
  })

  try {
    const saved = await newUser.save()
    if (saved) {
      emailRegister({ name, email, token })
      res.status(201).json({ ok: true, message: 'User registered' })
    }
  } catch (error) {
    next(error)
  }
}

export const Confirm = async (req, res, next) => {
  const { token } = req.params
  if (!token) {
    const error = new Error('Invalid token')
    error.name = 'ValidationError'
    return next(error)
  }

  const user = await User.findOne({ token })
  if (!user) {
    const error = new Error('Invalid token')
    error.name = 'ValidationError'
    return next(error)
  }

  try {
    user.active = true
    user.token = null
    if (user.save()) {
      res.json({ ok: true, message: 'User confirmed' })
    }
  } catch (error) {
    next(error)
  }
}

export const Profile = async (req, res, next) => {
  const { id } = req.params
  const { user } = req
  if (user.id !== id) {
    const error = new Error('You are not allowed to modify the information of this account')
    error.name = 'ForbiddenError'
    return next(error)
  }
  res.json({ ok: true, user })
}

export const UpdateProfile = async (req, res, next) => {
  const { id } = req.params
  const { user } = req
  const { name } = req.body

  if (!name) {
    const error = new Error('Missing data')
    error.name = 'ValidationError'
    return next(error)
  }

  if (user.id !== id) {
    const error = new Error('You are not allowed to modify the information of this account')
    error.name = 'ForbiddenError'
    return next(error)
  }

  try {
    const dbuser = await User.findById(user.id)
    dbuser.name = name
    if (dbuser.save()) {
      res.json({
        ok: true,
        user: {
          name: dbuser.name,
          email: dbuser.email,
          role: dbuser.role
        }
      })
    }
  } catch (error) {
    next(error)
  }
}

export const NotFound = (req, res, next) => {
  const error = new Error('Not Found')
  error.name = 'NotFoundError'
  return next(error)
}

export const ErrorHandler = (error, req, res, next) => {
  const { name, message } = error
  const ok = false
  switch (name) {
    case 'ValidationError':
      res.status(400).send({ ok, message })
      break
    case 'UnauthorizedError':
      res.status(401).send({ ok, message })
      break
    case 'ForbiddenError':
      res.status(403).send({ ok, message })
      break
    case 'NotFoundError':
      res.status(404).send({ ok, message })
      break
    default:
      res.status(500).send({ ok, message })
      break
  }
}
