import { Model } from 'mongoose'

import { IUserDocument } from 'api/user/model'
import { CustomDocument, PopulatedDoc } from 'database/interface/document'

export interface ISessionDocument extends CustomDocument {
  user: PopulatedDoc<IUserDocument>
  token: string
}

export interface ISessionModel extends Model<ISessionDocument> {}
