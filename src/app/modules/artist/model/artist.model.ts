import { Schema, model } from 'mongoose'

import { EntityNamesEnum } from 'database/constants/entityNames'
import {
  MAX_LENGTH_ARTIST_INFO,
  MAX_LENGTH_ARTIST_NAME,
  MIN_LENGTH_ARTIST_INFO,
  MIN_LENGTH_ARTIST_NAME,
} from 'modules/artist/constants'
import { IArtistDocument, IArtistModel } from 'modules/artist/model'

const toJson = require('@meanie/mongoose-to-json')
const uniqueValidation = require('mongoose-unique-validator')

const ArtistSchema = new Schema<IArtistDocument, IArtistModel, IArtistDocument>(
  {
    name: {
      // TODO: make capitalize
      type: String,
      required: true,
      trim: true,
      unique: 'Artist with name "{VALUE}" is already exists' as any,
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
