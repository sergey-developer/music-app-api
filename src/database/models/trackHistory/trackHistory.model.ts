import { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import {
  ITrackHistoryDocument,
  ITrackHistoryModel,
} from 'database/models/trackHistory/index'

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
    ref: EntityNamesEnum.Track,
    required: true,
    autopopulate: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: EntityNamesEnum.User,
    required: true,
  },
})

TrackHistorySchema.plugin(toJson)
TrackHistorySchema.plugin(autopopulate)

const TrackHistoryModel = model<ITrackHistoryDocument, ITrackHistoryModel>(
  EntityNamesEnum.TrackHistory,
  TrackHistorySchema,
)

export default TrackHistoryModel
