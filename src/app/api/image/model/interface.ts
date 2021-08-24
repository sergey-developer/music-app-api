import { Model } from 'mongoose'

import { CustomDocument } from 'database/interface/document'

export interface IImageDocument extends CustomDocument {
  src: string
  fileName: string
  originalName: string
}

export interface IImageModel extends Model<IImageDocument> {}
