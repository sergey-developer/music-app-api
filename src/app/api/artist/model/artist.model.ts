import { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import { IArtistDocument, IArtistModel } from 'api/artist/model'
import { ModelNamesEnum } from 'database/constants'
import uniqueValidation from 'database/plugins/uniqueValidation'

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
    },
    info: {
      type: String,
      default: null,
      trim: true,
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
