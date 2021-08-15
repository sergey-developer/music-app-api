import { Model, Schema, model } from 'mongoose'

import { IArtistModel } from 'api/artist/model'
import { ImageModel } from 'api/uploads/image/model'
import uniqueValidation from 'database/plugins/uniqueValidation'

const ArtistSchema: Schema = new Schema({
  name: {
    // TODO: make capitalize, validation
    type: String,
    required: true,
    trim: true,
    unique: 'Artist with name {value} is already exists',
  },
  info: {
    // TODO: make capitalize, validation
    type: String,
    default: null,
    trim: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  photo: {
    type: Schema.Types.ObjectId,
    ref: ImageModel.modelName,
    default: null,
  },
})

ArtistSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

ArtistSchema.plugin(uniqueValidation)

const ArtistModel: Model<IArtistModel> = model('artist', ArtistSchema)

export default ArtistModel
