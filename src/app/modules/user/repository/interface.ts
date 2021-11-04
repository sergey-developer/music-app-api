import { UserRoleEnum } from 'modules/user/constants'
import { CreateUserDto } from 'modules/user/dto'
import { IUserDocument } from 'modules/user/model'

export interface ICreateUserPayload extends CreateUserDto {
  role?: UserRoleEnum
}

export interface IFindOneUserFilter
  extends Partial<{
    email: IUserDocument['email']
  }> {}

export interface IDeleteOneUserFilter
  extends Partial<{ id: IUserDocument['id'] }> {}

export interface IUserRepository {
  findOne: (filter: IFindOneUserFilter) => Promise<IUserDocument>

  createOne: (payload: ICreateUserPayload) => Promise<IUserDocument>

  deleteOne: (filter: IDeleteOneUserFilter) => Promise<IUserDocument>
}
