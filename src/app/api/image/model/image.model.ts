import { Model, Schema, model } from 'mongoose'

import { IImageModel } from 'api/image/model'

const ImageSchema: Schema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
})

ImageSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const ImageModel: Model<IImageModel> = model('image', ImageSchema)

export default ImageModel
