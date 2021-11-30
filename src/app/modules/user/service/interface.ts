import { IUserDocument } from 'database/models/user'
import { CreateUserDto } from 'modules/user/dto'

export interface ICreateOneUserPayload extends CreateUserDto {}

export interface IUserService {
  getOneByEmail: (email: IUserDocument['email']) => Promise<IUserDocument>

  createOne: (payload: ICreateOneUserPayload) => Promise<IUserDocument>

  deleteOneById: (id: IUserDocument['id']) => Promise<IUserDocument>
}
