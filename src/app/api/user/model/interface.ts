import { Document } from 'mongoose'

export interface IUserModel extends Document {
  username: string
  password: string
}
