import { Error as MongooseError } from 'mongoose'

const dbErrorUtils = {
  isNotFound: (error: any): boolean =>
    error instanceof MongooseError.DocumentNotFoundError,
}

export default dbErrorUtils
