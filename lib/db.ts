import mongoose from 'mongoose'
import { resolveMongoUri } from './resolve-mongodb-uri'

const rawUri = process.env.MONGODB_URI

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function connectDB() {
  if (!rawUri) {
    throw new Error('MONGODB_URI is not defined')
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const uri = await resolveMongoUri(rawUri)
    cached.promise = mongoose.connect(uri).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

export default connectDB
