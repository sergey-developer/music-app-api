import { Model } from 'mongoose'

import { ITrackDocument } from 'api/track/model'
import { IUserDocument } from 'api/user/model'
import { CustomDocument, PopulatedDoc } from 'database/interface/document'

export interface ITrackHistoryDocument extends CustomDocument {
  track: PopulatedDoc<ITrackDocument>
  user: PopulatedDoc<IUserDocument>
  listenDate: string
}

export interface ITrackHistoryModel extends Model<ITrackHistoryDocument> {}
