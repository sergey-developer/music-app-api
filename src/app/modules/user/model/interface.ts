import { Model } from 'mongoose'

import { DocumentId } from 'database/interface/document'
import { UserRoleEnum } from 'modules/user/constants'

export interface IUserDocumentMethods {
  checkPassword: (password: string) => Promise<boolean>
}

export interface IUserDocument extends IUserDocumentMethods {
  id: DocumentId
  username: string
  email: string
  password: string
  role: UserRoleEnum
}

export interface IUserModel extends Model<IUserDocument> {}
