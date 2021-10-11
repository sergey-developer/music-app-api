import { Model } from 'mongoose'

export interface IImageDocument {
  id: string
  src: string
  fileName: string
  originalName: string
}

export interface IImageModel extends Model<IImageDocument> {}
