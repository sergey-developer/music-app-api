import { Model } from 'mongoose'

import { JwtPayload, JwtToken } from 'api/session/interface'
import { IUserDocument } from 'api/user/model'
import { CustomDocument, PopulatedDoc } from 'database/interface/document'

export interface ISessionDocument extends CustomDocument {
  id: string
  user: PopulatedDoc<IUserDocument>
  token: JwtToken
}

export interface ISessionModel extends Model<ISessionDocument> {
  generateToken: (payload: JwtPayload) => JwtToken
}
