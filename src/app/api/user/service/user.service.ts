import { IUserRepository, UserRepository } from 'api/user/repository'
import { IUserService } from 'api/user/service'
import { isNotFoundDBError } from 'database/utils/errors'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  badRequestError,
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
      if (isNotFoundDBError(error)) {
        throw notFoundError(`User with email "${email}" was not found`)
      }

      throw serverError(`Error while getting user by email "${email}"`)
    }
  }

  public deleteOneById: IUserService['deleteOneById'] = async (id) => {
    try {
      const user = await this.userRepository.deleteOneById(id)
      return user
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw notFoundError(`User with id "${id}" was not found`)
      }

      throw serverError(`Error while deleting user by id "${id}"`)
    }
  }
}

export default new UserService()
