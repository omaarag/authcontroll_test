import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import { app, server } from '../index.js'
import mongoose from 'mongoose'
import request from 'supertest'
import User from '../models/User.js'

const TESTUSER = {
  NAME: 'Omar Aguirre',
  EMAIL: 'omaaraguirre@hotmail.com',
  PASSWORD: 'password'
}

beforeAll(async () => {
  await User.deleteMany({})
})

describe('GET /api', () => {
  test('Should return a 404 status code and Not Found message', async () => {
    const response = await request(app).get('/api')
    expect(response.status).toBe(404)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Not Found')
  })
})

describe('POST /api/register', () => {
  test('Should return a 400 (Bad Request) status code if the input data is missing', async () => {
    const response = await request(app).post('/api/register')
    expect(response.status).toBe(400)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Missing data')
  })

  test('Should return a 400 (Bad Request) status code if the input data is not complete', async () => {
    const user = {
      name: TESTUSER.NAME,
      password: TESTUSER.PASSWORD
    }
    const response = await request(app).post('/api/register').send(user)
    expect(response.status).toBe(400)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Missing data')
  })

  test('Should return a 400 (Bad Request) status code if the email is not valid', async () => {
    const user = {
      name: TESTUSER.NAME,
      email: 'wrong@email',
      password: TESTUSER.PASSWORD,
      password2: TESTUSER.PASSWORD
    }
    const response = await request(app).post('/api/register').send(user)
    expect(response.status).toBe(400)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Invalid Email')
  })

  test('Should return a 400 (Bad Request) status code if the passwords do not match', async () => {
    const user = {
      name: TESTUSER.NAME,
      email: TESTUSER.EMAIL,
      password: TESTUSER.PASSWORD,
      password2: TESTUSER.PASSWORD.concat('wrong')
    }
    const response = await request(app).post('/api/register').send(user)
    expect(response.status).toBe(400)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Passwords do not match')
  })

  test('Should return a 201 (Created) status code if registered the new user', async () => {
    const user = {
      name: TESTUSER.NAME,
      email: TESTUSER.EMAIL,
      password: TESTUSER.PASSWORD,
      password2: TESTUSER.PASSWORD
    }
    const response = await request(app).post('/api/register').send(user)
    expect(response.status).toBe(201)
    expect(response.body.ok).toBe(true)
    expect(response.body.message).toEqual('User registered')
  })

  test('Should return a 403 (Forbidden) status code if the Email already registered', async () => {
    const user = {
      name: TESTUSER.NAME,
      email: TESTUSER.EMAIL,
      password: TESTUSER.PASSWORD,
      password2: TESTUSER.PASSWORD
    }
    const response = await request(app).post('/api/register').send(user)
    expect(response.status).toBe(403)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Email already registered')
  })
})

describe('GET /api/confirm/:token', () => {
  test('Should return a 400 (Unauthorized) status code if the token is invalid', async () => {
    const user = await User.findOne({ email: TESTUSER.EMAIL })
    const response = await request(app).get('/api/confirm/invalidtoken')
    expect(response.status).toBe(400)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Invalid token')

    const unModifiedUser = await User.findOne({ email: TESTUSER.EMAIL })
    expect(unModifiedUser.token).toEqual(user.token)
    expect(unModifiedUser.active).toEqual(false)
  }

  )

  test('Should return a 200 (OK) status code and activate account if the token is valid', async () => {
    const user = await User.findOne({ email: TESTUSER.EMAIL })
    const response = await request(app).get(`/api/confirm/${user.token}`)
    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
    expect(response.body.message).toEqual('User confirmed')

    const modifiedUser = await User.findOne({ email: TESTUSER.EMAIL })
    expect(modifiedUser.token).toEqual(null)
    expect(modifiedUser.active).toEqual(true)
  })
})

describe('POST /api/login', () => {
  test('Should return a 401 (Unauthorized) status code if the credentials are misisng', async () => {
    const response = await request(app).post('/api/login')
    expect(response.status).toBe(401)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Missing credentials')
  })

  test('Should return a 401 (Unauthorized) status code if the email is incorrect', async () => {
    const data = { email: 'wrong@email.com', password: TESTUSER.PASSWORD }
    const response = await request(app).post('/api/login').send(data)
    expect(response.status).toBe(401)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('User not found')
  })

  test('Should return a 401 (Unauthorized) status code if the password is incorrect', async () => {
    const data = { email: TESTUSER.EMAIL, password: 'wrongpassword' }
    const response = await request(app).post('/api/login').send(data)
    expect(response.status).toBe(401)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Wrong password')
  })

  test('Should return a 401 (Unauthorized) status code if the account is not activated/confirmed', async () => {
    const user = await User.findOne({ email: TESTUSER.EMAIL })
    user.active = false
    await user.save()

    const data = { email: TESTUSER.EMAIL, password: TESTUSER.PASSWORD }
    const response = await request(app).post('/api/login').send(data)
    expect(response.status).toBe(401)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Account not confirmed')
  })

  test('Should return a 200 (OK) status code and a valid authentication token if the credentials are correct and the account activated', async () => {
    const user = await User.findOne({ email: TESTUSER.EMAIL })
    user.active = true
    await user.save()

    const data = { email: TESTUSER.EMAIL, password: TESTUSER.PASSWORD }
    const response = await request(app).post('/api/login').send(data)
    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
    expect(response.body.user.email).toEqual(TESTUSER.EMAIL)
    expect(response.body.user.jwt).toBeDefined()

    logged = response.body.user
  })
})

let logged = {}

describe('GET /api/user/:id', () => {
  test('Should return a 401 (Unauthorized) status code if the user is not authenticated', async () => {
    const response = await request(app).get(`/api/user/${logged.id}`)
    expect(response.status).toBe(401)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Authentication error')
    expect(response.body.user).not.toBeDefined()
  })

  test('Should return a 403 (Forbidden) status code if the user attempts to modify another user\'s data', async () => {
    const response = await request(app).get('/api/user/1234567890')
      .set('Authorization', 'Bearer ' + logged.jwt)
    expect(response.status).toBe(403)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('You are not allowed to modify the information of this account')
    expect(response.body.user).not.toBeDefined()
  })

  test('Should return a 200 (OK) status code and allow modifying the data of an authenticated user', async () => {
    const response = await request(app).get(`/api/user/${logged.id}`)
      .set('Authorization', 'Bearer ' + logged.jwt)
    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
    expect(response.body.user).toBeDefined()
  })
})

describe('PUT /api/user/:id', () => {
  test('Should return a 401 (Unauthorized) status code if the user is not authenticated', async () => {
    const response = await request(app).put(`/api/user/${logged.id}`)
    expect(response.status).toBe(401)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Authentication error')
    expect(response.body.jwt).not.toBeDefined()
  })

  test('Should return a 400 (Bad Request) status code if the input data is missing', async () => {
    const response = await request(app).put(`/api/user/${logged.id}`)
      .set('Authorization', 'Bearer ' + logged.jwt)
    expect(response.status).toBe(400)
    expect(response.body.ok).toBe(false)
    expect(response.body.message).toEqual('Missing data')
  })

  test('Should return a 200 (OK) status code and the updated user\'s data on success', async () => {
    const user = { name: 'Omar Aguirre Modified' }
    const response = await request(app).put(`/api/user/${logged.id}`).send(user)
      .set('Authorization', 'Bearer ' + logged.jwt)
    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
    expect(response.body.user.name).toEqual('Omar Aguirre Modified')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
  server.close()
})
