import { CreateUserDto } from 'api/user/dto'
import { IUserDocument } from 'api/user/model'
import { IUserRepository } from 'api/user/repository'

export interface ICreateUserServicePayload extends CreateUserDto {}

export interface IUserService {
  create: (payload: ICreateUserServicePayload) => Promise<IUserDocument>

  getOneByEmail: IUserRepository['findOneByEmail']
}
