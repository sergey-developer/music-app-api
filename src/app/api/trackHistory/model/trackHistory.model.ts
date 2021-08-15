import { Model, Schema, model } from 'mongoose'

import { TrackModel } from 'api/track/model'
import { ITrackHistoryModel } from 'api/trackHistory/model'
import { UserModel } from 'api/user/model'

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

TrackHistorySchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const TrackHistoryModel: Model<ITrackHistoryModel> = model(
  'trackHistory',
  TrackHistorySchema,
)

export default TrackHistoryModel
