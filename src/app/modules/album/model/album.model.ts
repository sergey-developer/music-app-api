import { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
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
    type: String,
    default: null,
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: EntityNamesEnum.Artist,
    required: true,
    autopopulate: true,
  },
})

AlbumSchema.plugin(toJson)
AlbumSchema.plugin(autopopulate)

const AlbumModel = model<IAlbumDocument, IAlbumModel>(
  EntityNamesEnum.Album,
  AlbumSchema,
)

export default AlbumModel
