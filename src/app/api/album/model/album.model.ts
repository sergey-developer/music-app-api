import { Model, Schema, model } from 'mongoose'

import { IAlbumModel } from 'api/album/model'
import { ArtistModel } from 'api/artist/model'
import { ImageModel } from 'api/image/model'

const AlbumSchema = new Schema({
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

AlbumSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const AlbumModel: Model<IAlbumModel> = model('album', AlbumSchema)

export default AlbumModel
