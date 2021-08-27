import { UserModel } from 'api/user/model'
import { IUserRepository } from 'api/user/repository'

class UserRepository implements IUserRepository {
  private readonly user: typeof UserModel

  public constructor() {
    this.user = UserModel
  }

  public create: IUserRepository['create'] = async (payload) => {
    const user = new this.user(payload)
    return user.save()
  }

  public findOneByEmail: IUserRepository['findOneByEmail'] = async (email) => {
    return this.user.findOne({ email }).exec()
  }
}

export default new UserRepository()
