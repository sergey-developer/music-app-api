import { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import { ModelNamesEnum } from 'database/constants'
import uniqueValidation from 'database/plugins/uniqueValidation'
import {
  MAX_LENGTH_ARTIST_INFO,
  MAX_LENGTH_ARTIST_NAME,
  MIN_LENGTH_ARTIST_INFO,
  MIN_LENGTH_ARTIST_NAME,
} from 'modules/artist/constants'
import { IArtistDocument, IArtistModel } from 'modules/artist/model'

const toJson = require('@meanie/mongoose-to-json')

const ArtistSchema = new Schema<IArtistDocument, IArtistModel, IArtistDocument>(
  {
    // @ts-ignore
    name: {
      // TODO: make capitalize, validation
      type: String,
      required: true,
      trim: true,
      unique: 'Artist with name {value} is already exists',
      minlength: MIN_LENGTH_ARTIST_NAME,
      maxlength: MAX_LENGTH_ARTIST_NAME,
    },
    info: {
      type: String,
      default: null,
      trim: true,
      minlength: MIN_LENGTH_ARTIST_INFO,
      maxlength: MAX_LENGTH_ARTIST_INFO,
      // TODO: make capitalize, validation
    },
    photo: {
      type: Schema.Types.ObjectId,
      ref: ModelNamesEnum.Image,
      default: null,
      autopopulate: true,
    },
  },
)

ArtistSchema.plugin(toJson)
ArtistSchema.plugin(autopopulate)
ArtistSchema.plugin(uniqueValidation)

const ArtistModel = model<IArtistDocument, IArtistModel>(
  ModelNamesEnum.Artist,
  ArtistSchema,
)

export default ArtistModel
