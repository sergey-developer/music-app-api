import { IUserDocument } from 'modules/user/model'
import { ICreateUserServicePayload } from 'modules/user/service'

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
