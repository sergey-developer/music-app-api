import { Model, model, Schema } from 'mongoose'

import { ArtistModelName } from 'api/artist/model'
import ModelName from 'shared/utils/modelName'

import { IAlbum } from './types'

const AlbumSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  published: {
    type: Boolean,
    default: false,
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: ArtistModelName.name,
    required: true,
  },
})

const AlbumModelName = new ModelName('album')

const AlbumModel: Model<IAlbum> = model(AlbumModelName.name, AlbumSchema)

export {
  AlbumModelName,
}

export default AlbumModel
