import { IUserRepository, UserRepository } from 'api/user/repository'
import { IUserService } from 'api/user/service'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  badRequestError,
  isNotFoundError,
  notFoundError,
  serverError,
} from 'shared/utils/errors/httpErrors'

class UserService implements IUserService {
  private readonly userRepository: IUserRepository

  public constructor() {
    this.userRepository = UserRepository
  }

  public create: IUserService['create'] = async (payload) => {
    try {
      const user = await this.userRepository.create(payload)
      return user
    } catch (error) {
      if (isValidationError(error.name)) {
        throw badRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      throw serverError('Error while creating new user')
    }
  }

  public getOneByEmail: IUserService['getOneByEmail'] = async (email) => {
    try {
      const user = await this.userRepository.findOne({ email })
      return user
    } catch (error) {
      if (isNotFoundError(error)) {
        throw notFoundError(`User with email "${email}" was not found`)
      }

      throw serverError(`Error while getting user by email "${email}"`)
    }
  }
}

export default new UserService()
