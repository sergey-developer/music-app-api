import { CreateUserDto } from 'api/user/dto'
import { IUserDocument } from 'api/user/model'

export interface ICreateUserServicePayload extends CreateUserDto {}

export interface IUserService {
  create: (payload: ICreateUserServicePayload) => Promise<IUserDocument>

  getOneByEmail: (email: IUserDocument['email']) => Promise<IUserDocument>

  deleteOneById: (id: IUserDocument['id']) => Promise<IUserDocument>
}
