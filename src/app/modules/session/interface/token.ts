import { IUserDocument } from 'database/models/user'

export type JwtPayload = Pick<IUserDocument, 'email' | 'role'> & {
  userId: IUserDocument['id']
}

export type JwtToken = string

export type JwtVerifyResult = JwtPayload
