import mongoose from 'mongoose'

const connectMongo = async (connectionString, env) => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log(`Connected to MongoDB in ${env} mode`)
  } catch (error) {
    console.log('Error connecting to MongoDB:', error.message)
  }
}

export default connectMongo
