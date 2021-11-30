import { Document, Model, PopulatedDoc } from 'mongoose'

import { DocumentId } from 'database/interface/document'
import { ITrackDocument } from 'database/models/track'
import { IUserDocument } from 'database/models/user'

export interface ITrackHistoryDocument extends Document {
  id: DocumentId
  track: PopulatedDoc<ITrackDocument>
  user: PopulatedDoc<IUserDocument>
  listenDate: string
}

export interface ITrackHistoryDocumentArray
  extends Array<ITrackHistoryDocument> {}

export interface ITrackHistoryModel extends Model<ITrackHistoryDocument> {}
