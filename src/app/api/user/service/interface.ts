import { IUserRepository } from 'api/user/repository'

export interface IUserService {
  create: IUserRepository['create']
  getOneByEmail: IUserRepository['findOneByEmail']
}
