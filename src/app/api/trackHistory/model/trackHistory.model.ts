import { Model, Schema, model } from 'mongoose'

import { TrackModel } from 'api/track/model'
import { ITrackHistoryModel } from 'api/trackHistory/model'
import { UserModel } from 'api/user/model'

const toJson = require('@meanie/mongoose-to-json')

const TrackHistorySchema = new Schema({
  listenDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  track: {
    type: Schema.Types.ObjectId,
    ref: TrackModel.modelName,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: UserModel.modelName,
    required: true,
  },
})

TrackHistorySchema.plugin(toJson)

const TrackHistoryModel: Model<ITrackHistoryModel> = model(
  'TrackHistory',
  TrackHistorySchema,
)

export default TrackHistoryModel
