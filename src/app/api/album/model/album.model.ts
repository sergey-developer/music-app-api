import { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import { IAlbumDocument, IAlbumModel } from 'api/album/model'
import { ArtistModel } from 'api/artist/model'
import { ImageModel } from 'api/image/model'

const toJson = require('@meanie/mongoose-to-json')
const uniqueValidation = require('mongoose-beautiful-unique-validation')

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
  // @ts-ignore
  image: {
    type: Schema.Types.ObjectId,
    ref: ImageModel.modelName,
    default: null,
    autopopulate: true,
    unique: 'Image source must be unique',
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: ArtistModel.modelName,
    required: true,
    autopopulate: true,
  },
})

AlbumSchema.post('findOneAndDelete', function (doc) {
  console.log({ findOneAndDelete: doc })
})

AlbumSchema.plugin(toJson)
AlbumSchema.plugin(autopopulate)
AlbumSchema.plugin(uniqueValidation)

const AlbumModel = model<IAlbumDocument, IAlbumModel>('Album', AlbumSchema)

export default AlbumModel
