import { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import {
  ITrackHistoryDocument,
  ITrackHistoryModel,
} from 'api/trackHistory/model'
import { ModelNamesEnum } from 'database/constants'

const toJson = require('@meanie/mongoose-to-json')

const TrackHistorySchema = new Schema<
  ITrackHistoryDocument,
  ITrackHistoryModel,
  ITrackHistoryDocument
>({
  listenDate: {
    type: String,
    required: true,
  },
  track: {
    type: Schema.Types.ObjectId,
    ref: ModelNamesEnum.Track,
    required: true,
    autopopulate: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: ModelNamesEnum.User,
    required: true,
  },
})

TrackHistorySchema.plugin(toJson)
TrackHistorySchema.plugin(autopopulate)

const TrackHistoryModel = model<ITrackHistoryDocument, ITrackHistoryModel>(
  ModelNamesEnum.TrackHistory,
  TrackHistorySchema,
)

export default TrackHistoryModel
