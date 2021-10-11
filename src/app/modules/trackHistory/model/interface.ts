import { Model } from 'mongoose'

import { PopulatedDoc } from 'database/interface/document'
import { ITrackDocument } from 'modules/track/model'
import { IUserDocument } from 'modules/user/model'

export interface ITrackHistoryDocument {
  id: string
  track: PopulatedDoc<ITrackDocument>
  user: PopulatedDoc<IUserDocument>
  listenDate: string
}

export interface ITrackHistoryModel extends Model<ITrackHistoryDocument> {}
