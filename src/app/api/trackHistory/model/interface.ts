import { Model } from 'mongoose'

import { ITrackDocument } from 'api/track/model'
import { IUserDocument } from 'api/user/model'
import { PopulatedDoc } from 'database/interface/document'

export interface ITrackHistoryDocument {
  id: string
  track: PopulatedDoc<ITrackDocument>
  user: PopulatedDoc<IUserDocument>
  listenDate: string
}

export interface ITrackHistoryModel extends Model<ITrackHistoryDocument> {}
