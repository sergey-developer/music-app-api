import { CreateUserDto } from 'api/user/dto'
import { IUserDocument } from 'api/user/model'

export interface IUserRepository {
  create: (payload: CreateUserDto) => Promise<IUserDocument>
}
