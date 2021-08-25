import { Schema, model } from 'mongoose'

import { IAlbumDocument, IAlbumModel } from 'api/album/model'
import { ArtistModel } from 'api/artist/model'
import { ImageModel } from 'api/image/model'

const toJson = require('@meanie/mongoose-to-json')

const AlbumSchema = new Schema<IAlbumDocument, IAlbumModel, IAlbumDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  releaseDate: {
    type: Date,
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

const AlbumModel = model<IAlbumDocument, IAlbumModel>('Album', AlbumSchema)

export default AlbumModel
