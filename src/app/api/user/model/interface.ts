import { Model } from 'mongoose'

import { UserRoleEnum } from 'api/user/interface'

export interface IUserDocumentMethods {
  checkPassword: (password: string) => Promise<boolean>
}

export interface IUserDocument extends IUserDocumentMethods {
  id: string
  username: string
  email: string
  password: string
  role: UserRoleEnum
}

export interface IUserModel extends Model<IUserDocument> {}
