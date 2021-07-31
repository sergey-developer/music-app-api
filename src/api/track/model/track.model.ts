import { Model, model, Schema } from 'mongoose'

import { AlbumModelName } from 'api/album/model'
import ModelName from 'shared/utils/modelName'

import { ITrack } from './types'

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
    ref: AlbumModelName.name,
    required: true,
  },
})

const TrackModelName = new ModelName('track')

const TrackModel: Model<ITrack> = model(TrackModelName.name, TrackSchema)

export {
  TrackModelName,
}

export default TrackModel
