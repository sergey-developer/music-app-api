import { Model, Schema, model } from 'mongoose'

import { AlbumModel } from 'api/album/model'
import { ITrackModel } from 'api/track/model'

const toJson = require('@meanie/mongoose-to-json')

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

TrackSchema.plugin(toJson)

const TrackModel: Model<ITrackModel> = model('Track', TrackSchema)

export default TrackModel
