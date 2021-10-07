import { Model } from 'mongoose'

import { JwtPayload, JwtToken } from 'api/session/interface'
import { IUserDocument } from 'api/user/model'
import { PopulatedDoc } from 'database/interface/document'

export interface ISessionDocument {
  id: string
  user: PopulatedDoc<IUserDocument>
  token: JwtToken
}

export interface ISessionModel extends Model<ISessionDocument> {
  generateToken: (payload: JwtPayload) => JwtToken
}
