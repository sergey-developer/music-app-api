import { CreateUserDto } from 'modules/user/dto'
import { IUserDocument } from 'modules/user/model'

export interface ICreateOneUserPayload extends CreateUserDto {}

export interface IUserService {
  getOneByEmail: (email: IUserDocument['email']) => Promise<IUserDocument>

  createOne: (payload: ICreateOneUserPayload) => Promise<IUserDocument>

  deleteOneById: (id: IUserDocument['id']) => Promise<IUserDocument>
}
