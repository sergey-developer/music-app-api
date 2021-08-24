import { Document, Model, Types } from 'mongoose'

export interface IImageDocument extends Document<Types.ObjectId> {
  id: string
  src: string
  fileName: string
  originalName: string
}

export interface IImageModel extends Model<IImageDocument> {}
