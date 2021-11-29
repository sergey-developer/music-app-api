import { Model, PopulatedDoc } from 'mongoose'

import { DocumentId } from 'database/interface/document'
import { JwtPayload, JwtToken } from 'modules/session/interface'
import { IUserDocument } from 'modules/user/model'

export interface ISessionDocument {
  id: DocumentId
  user: PopulatedDoc<IUserDocument>
  token: JwtToken
}

export interface ISessionModel extends Model<ISessionDocument> {
  generateToken: (payload: JwtPayload) => JwtToken
}
