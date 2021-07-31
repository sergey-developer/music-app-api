import { Model, model, Schema } from 'mongoose'

import ModelName from 'shared/utils/modelName'

import { IArtist } from './types'

const ArtistSchema: Schema = new Schema({
  name: {
    // TODO: make capitalize, validation
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  photo: {
    type: String,
    default: null,
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
})

const ArtistModelName = new ModelName('artist')

const ArtistModel: Model<IArtist> = model(ArtistModelName.name, ArtistSchema)

export {
  ArtistModelName
}

export default ArtistModel
