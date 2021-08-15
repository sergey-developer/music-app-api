import { Document } from 'mongoose'

export interface IImageModel extends Document {
  src: string
  fileName: string
  originalName: string
}
