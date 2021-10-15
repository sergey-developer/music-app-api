import { IUserDocument } from 'modules/user/model'
import { ICreateUserServicePayload } from 'modules/user/service'

export interface ICreateUserRepositoryPayload
  extends ICreateUserServicePayload {}

export interface IFindOneUserRepositoryFilter
  extends Partial<{
    email: IUserDocument['email']
  }> {}

export interface IUserRepository {
  findOne: (filter: IFindOneUserRepositoryFilter) => Promise<IUserDocument>

  create: (payload: ICreateUserRepositoryPayload) => Promise<IUserDocument>

  deleteOneById: (id: IUserDocument['id']) => Promise<IUserDocument>
}
