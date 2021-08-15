import { Model, Schema, model } from 'mongoose'

import { AlbumModel } from 'api/album/model'
import { ITrackModel } from 'api/track/model'

const TrackSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  youtube: {
    type: String,
    uniq: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: AlbumModel.modelName,
    required: true,
  },
})

TrackSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const TrackModel: Model<ITrackModel> = model('track', TrackSchema)

export default TrackModel
