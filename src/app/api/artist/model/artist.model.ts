import { Schema, model } from 'mongoose'

import { IArtistDocument, IArtistModel } from 'api/artist/model'
import { ImageModel } from 'api/image/model'
import uniqueValidation from 'database/plugins/uniqueValidation'

const toJson = require('@meanie/mongoose-to-json')

const ArtistSchema = new Schema<IArtistDocument, IArtistModel>({
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
  published: {
    type: Boolean,
    default: false,
  },
  photo: {
    type: Schema.Types.ObjectId,
    ref: ImageModel.modelName,
    default: null,
  },
})

ArtistSchema.plugin(toJson)
ArtistSchema.plugin(uniqueValidation)

const ArtistModel = model<IArtistDocument, IArtistModel>('Artist', ArtistSchema)

export default ArtistModel
