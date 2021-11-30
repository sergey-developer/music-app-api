import { Schema, model } from 'mongoose'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import { IArtistDocument, IArtistModel } from 'database/models/artist'
import {
  MAX_LENGTH_ARTIST_INFO,
  MAX_LENGTH_ARTIST_NAME,
  MIN_LENGTH_ARTIST_INFO,
  MIN_LENGTH_ARTIST_NAME,
} from 'modules/artist/constants'

const toJson = require('@meanie/mongoose-to-json')
const uniqueValidation = require('mongoose-unique-validator')

const ArtistSchema = new Schema<IArtistDocument, IArtistModel, IArtistDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: 'Artist with name "{VALUE}" already exists' as any,
      minlength: MIN_LENGTH_ARTIST_NAME,
      maxlength: MAX_LENGTH_ARTIST_NAME,
    },
    info: {
      type: String,
      default: null,
      trim: true,
      minlength: MIN_LENGTH_ARTIST_INFO,
      maxlength: MAX_LENGTH_ARTIST_INFO,
    },
    photo: {
      type: String,
      default: null,
    },
  },
)

ArtistSchema.plugin(toJson)
ArtistSchema.plugin(uniqueValidation)

const ArtistModel = model<IArtistDocument, IArtistModel>(
  EntityNamesEnum.Artist,
  ArtistSchema,
)

export default ArtistModel
