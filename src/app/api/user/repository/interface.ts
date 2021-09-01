import { IUserDocument } from 'api/user/model'
import { ICreateUserServicePayload } from 'api/user/service'
import { MaybeNull } from 'shared/interface/utils/common'

export interface ICreateUserRepositoryPayload
  extends ICreateUserServicePayload {}

export interface IUserRepository {
  create: (payload: ICreateUserRepositoryPayload) => Promise<IUserDocument>

  findOneByEmail: (
    email: IUserDocument['email'],
  ) => Promise<MaybeNull<IUserDocument>>
}
