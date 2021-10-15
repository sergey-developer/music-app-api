import { CreateUserDto } from 'modules/user/dto'
import { IUserDocument } from 'modules/user/model'

export interface ICreateUserServicePayload extends CreateUserDto {}

export interface IUserService {
  getOneByEmail: (email: IUserDocument['email']) => Promise<IUserDocument>

  create: (payload: ICreateUserServicePayload) => Promise<IUserDocument>

  deleteOneById: (id: IUserDocument['id']) => Promise<IUserDocument>
}
