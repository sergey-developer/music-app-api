import { Model, Schema, model } from 'mongoose'

import { IAlbumModel } from 'api/album/model'
import { ArtistModel } from 'api/artist/model'
import { ImageModel } from 'api/image/model'

const toJson = require('@meanie/mongoose-to-json')

const AlbumSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  image: {
    // TODO: add unique
    type: Schema.Types.ObjectId,
    ref: ImageModel.modelName,
    default: null,
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: ArtistModel.modelName,
    required: true,
  },
})

AlbumSchema.plugin(toJson)

const AlbumModel: Model<IAlbumModel> = model('Album', AlbumSchema)

export default AlbumModel
