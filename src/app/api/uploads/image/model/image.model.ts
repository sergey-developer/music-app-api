import { Model, Schema, model } from 'mongoose'

import { IImageModel } from 'api/uploads/image/model'

const ImageSchema: Schema = new Schema({
  name: {
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
