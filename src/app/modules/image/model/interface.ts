import { Model } from 'mongoose'

import { DocumentId } from 'database/interface/document'

export interface IImageDocument {
  id: DocumentId
  src: string
  fileName: string
  originalName: string
}

export interface IImageModel extends Model<IImageDocument> {}
