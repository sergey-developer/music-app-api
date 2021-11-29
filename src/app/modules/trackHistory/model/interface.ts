import { Document, Model, PopulatedDoc } from 'mongoose'

import { DocumentId } from 'database/interface/document'
import { ITrackDocument } from 'modules/track/model'
import { IUserDocument } from 'modules/user/model'

export interface ITrackHistoryDocument extends Document {
  id: DocumentId
  track: PopulatedDoc<ITrackDocument>
  user: PopulatedDoc<IUserDocument>
  listenDate: string
}

export interface ITrackHistoryModel extends Model<ITrackHistoryDocument> {}
