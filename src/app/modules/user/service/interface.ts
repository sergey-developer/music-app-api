import { CreateUserDto } from 'modules/user/dto'
import { IUserDocument } from 'modules/user/model'

export interface ICreateUserServicePayload extends CreateUserDto {}

export interface IUserService {
  create: (payload: ICreateUserServicePayload) => Promise<IUserDocument>

  getOneByEmail: (email: IUserDocument['email']) => Promise<IUserDocument>

  deleteOneById: (id: IUserDocument['id']) => Promise<IUserDocument>
}
