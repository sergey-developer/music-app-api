import { Schema, model } from 'mongoose'

import { IImageDocument, IImageModel } from 'api/image/model'
import { ModelNamesEnum } from 'database/constants'

const toJson = require('@meanie/mongoose-to-json')

const ImageSchema = new Schema<IImageDocument, IImageModel, IImageDocument>({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  src: {
    // TODO: validate as url
    type: String,
    required: true,
    unique: true,
  },
})

ImageSchema.plugin(toJson)

const ImageModel = model<IImageDocument, IImageModel>(
  ModelNamesEnum.Image,
  ImageSchema,
)

export default ImageModel
