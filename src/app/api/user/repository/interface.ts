import { CreateUserDto } from 'api/user/dto'
import { IUserDocument } from 'api/user/model'
import { MaybeNull } from 'shared/interface/utils/common'

export interface IUserRepository {
  create: (payload: CreateUserDto) => Promise<IUserDocument>
  findOneByEmail: (
    email: IUserDocument['email'],
  ) => Promise<MaybeNull<IUserDocument>>
}
