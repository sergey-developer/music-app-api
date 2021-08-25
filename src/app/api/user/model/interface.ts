import { Model } from 'mongoose'

import { UserRoleEnum } from 'api/user/interface'
import { CustomDocument } from 'database/interface/document'

export interface IUserDocument extends CustomDocument {
  firstname: string
  lastname: string
  email: string
  password: string
  role: UserRoleEnum
}

export interface IUserModel extends Model<IUserDocument> {}
