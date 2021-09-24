import { Error as MongooseError } from 'mongoose'

export default (error: any): boolean => {
  return error instanceof MongooseError.DocumentNotFoundError
}
