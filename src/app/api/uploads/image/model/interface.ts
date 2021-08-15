import { Document } from 'mongoose'

export interface IImageModel extends Document {
  name: string
  src: string
}
