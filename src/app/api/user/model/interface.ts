import { Document, Model, Types } from 'mongoose'

import { UserRoleEnum } from 'api/user/interface'

export interface IUserDocument extends Document<Types.ObjectId> {
  id: string
  username: string
  password: string
  role: UserRoleEnum
}

export interface IUserModel extends Model<IUserDocument> {}
