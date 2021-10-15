import { CreateUserDto } from 'modules/user/dto'
import { IUserDocument } from 'modules/user/model'

export interface ICreateUserPayload extends CreateUserDto {}

export interface IUserService {
  getOneByEmail: (email: IUserDocument['email']) => Promise<IUserDocument>

  create: (payload: ICreateUserPayload) => Promise<IUserDocument>

  deleteOneById: (id: IUserDocument['id']) => Promise<IUserDocument>
}
