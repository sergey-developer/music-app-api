import { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import { ModelNamesEnum } from 'database/constants'
import uniqueValidation from 'database/plugins/uniqueValidation'
import { IAlbumDocument, IAlbumModel } from 'modules/album/model'

const toJson = require('@meanie/mongoose-to-json')

const AlbumSchema = new Schema<IAlbumDocument, IAlbumModel, IAlbumDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: ModelNamesEnum.Image,
    default: null,
    autopopulate: true,
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: ModelNamesEnum.Artist,
    required: true,
    autopopulate: true,
  },
})

AlbumSchema.plugin(toJson)
AlbumSchema.plugin(autopopulate)
AlbumSchema.plugin(uniqueValidation)

const AlbumModel = model<IAlbumDocument, IAlbumModel>(
  ModelNamesEnum.Album,
  AlbumSchema,
)

export default AlbumModel
