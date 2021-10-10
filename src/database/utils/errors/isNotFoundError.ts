import { Error as MongooseError } from 'mongoose'

export default (error: unknown): boolean =>
  error instanceof MongooseError.DocumentNotFoundError
