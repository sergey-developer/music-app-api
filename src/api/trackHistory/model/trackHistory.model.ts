import { Model, model, Schema } from 'mongoose'

import { TrackModelName } from 'api/track/model'
import { UserModelName } from 'api/user/model'
import ModelName from 'shared/utils/modelName'

import { ITrackHistory } from './types'

const TrackHistorySchema = new Schema({
  listenDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  track: {
    type: Schema.Types.ObjectId,
    ref: TrackModelName.name,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: UserModelName.name,
    required: true,
  },
})

const TrackHistoryModelName = new ModelName('trackHistory')

const TrackHistoryModel: Model<ITrackHistory> = model(TrackHistoryModelName.name, TrackHistorySchema)

export {
  TrackHistoryModelName,
}

export default TrackHistoryModel
