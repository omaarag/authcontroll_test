import dotenv from 'dotenv'
import connectMongo from './mongo.js'
import express from 'express'
import cors from 'cors'
import { ErrorHandler, Login, NotFound, Profile, Register, Confirm, UpdateProfile, Auth } from './controllers/Auth.js'
import Protected from './middleware/Protected.js'

dotenv.config()
const { MONGODB_URI, MONGODB_URI_TEST, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test' ? MONGODB_URI_TEST : MONGODB_URI
connectMongo(connectionString, NODE_ENV)

export const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/login', Login)
app.post('/api/register', Register)
app.get('/api/confirm/:token', Confirm)

app.get('/api/auth', Protected, Auth)
app.get('/api/user/:id', Protected, Profile)
app.put('/api/user/:id', Protected, UpdateProfile)

app.use(NotFound)
app.use(ErrorHandler)

const PORT = process.env.PORT || 3000
export const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
