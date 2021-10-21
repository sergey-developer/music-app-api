import { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import { ModelNamesEnum } from 'database/constants'
import uniqueValidation from 'database/plugins/uniqueValidation'
import {
  MAX_LENGTH_ALBUM_NAME,
  MIN_LENGTH_ALBUM_NAME,
} from 'modules/album/constants'
import { IAlbumDocument, IAlbumModel } from 'modules/album/model'

const toJson = require('@meanie/mongoose-to-json')

const AlbumSchema = new Schema<IAlbumDocument, IAlbumModel, IAlbumDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: MIN_LENGTH_ALBUM_NAME,
    maxlength: MAX_LENGTH_ALBUM_NAME,
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
