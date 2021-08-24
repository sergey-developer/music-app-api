import { Document, Model, Types } from 'mongoose'

import { ITrackDocument } from 'api/track/model'
import { IUserDocument } from 'api/user/model'
import { PopulatedDoc } from 'database/interface/document'

export interface ITrackHistoryDocument extends Document<Types.ObjectId> {
  id: string
  track: PopulatedDoc<ITrackDocument>
  user: PopulatedDoc<IUserDocument>
  listenDate: number
}

export interface ITrackHistoryModel extends Model<ITrackHistoryDocument> {}
