import { MongoClient } from 'mongodb'
import { resolveMongoUri } from './resolve-mongodb-uri'

const rawUri = process.env.MONGODB_URI

if (!rawUri) {
  throw new Error('MONGODB_URI is not defined')
}

const uri = await resolveMongoUri(rawUri)

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient
}

export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(uri)

if (process.env.NODE_ENV !== 'production') {
  globalForMongo.mongoClient = mongoClient
}

export const mongoDb = mongoClient.db()
