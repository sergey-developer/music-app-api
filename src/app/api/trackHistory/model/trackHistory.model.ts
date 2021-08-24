import { Schema, model } from 'mongoose'

import { TrackModel } from 'api/track/model'
import {
  ITrackHistoryDocument,
  ITrackHistoryModel,
} from 'api/trackHistory/model'
import { UserModel } from 'api/user/model'

const toJson = require('@meanie/mongoose-to-json')

const TrackHistorySchema = new Schema<
  ITrackHistoryDocument,
  ITrackHistoryModel,
  ITrackHistoryDocument
>({
  listenDate: {
    // TODO: валидировать это в dto или ставить по умолчанию как ISOString
    type: String,
    required: true,
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

const TrackHistoryModel = model<ITrackHistoryDocument, ITrackHistoryModel>(
  'TrackHistory',
  TrackHistorySchema,
)

export default TrackHistoryModel
