import { Model, PopulatedDoc } from 'mongoose'

import { DocumentId } from 'database/interface/document'
import { IUserDocument } from 'database/models/user'
import { JwtPayload, JwtToken } from 'modules/session/interface'

export interface ISessionDocument {
  id: DocumentId
  user: PopulatedDoc<IUserDocument>
  token: JwtToken
}

export interface ISessionModel extends Model<ISessionDocument> {
  generateToken: (payload: JwtPayload) => JwtToken
}
