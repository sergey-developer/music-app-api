import { IUserDocument } from 'database/models/user'
import { UserRoleEnum } from 'modules/user/constants'
import { CreateUserDto } from 'modules/user/dto'

export interface ICreateOneUserPayload extends CreateUserDto {
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

  createOne: (payload: ICreateOneUserPayload) => Promise<IUserDocument>

  deleteOne: (filter: IDeleteOneUserFilter) => Promise<IUserDocument>
}
