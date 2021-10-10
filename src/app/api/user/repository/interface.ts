import { IUserDocument } from 'api/user/model'
import { ICreateUserServicePayload } from 'api/user/service'

export interface ICreateUserRepositoryPayload
  extends ICreateUserServicePayload {}

export interface IFindOneUserRepositoryFilter
  extends Partial<{
    email: IUserDocument['email']
  }> {}

export interface IUserRepository {
  create: (payload: ICreateUserRepositoryPayload) => Promise<IUserDocument>

  findOne: (filter: IFindOneUserRepositoryFilter) => Promise<IUserDocument>

  deleteOneById: (id: IUserDocument['id']) => Promise<IUserDocument>
}
