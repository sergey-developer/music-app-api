import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import { IUserRepository, UserRepository } from 'modules/user/repository'
import { IUserService } from 'modules/user/service'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
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
        throw BadRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      logger.error(error.stack)
      throw ServerError('Error while creating new user')
    }
  }

  public getOneByEmail: IUserService['getOneByEmail'] = async (email) => {
    try {
      const user = await this.userRepository.findOne({ email })
      return user
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError(`User with email "${email}" was not found`)
      }

      logger.error(error.stack)
      throw ServerError('Error while getting user')
    }
  }

  public deleteOneById: IUserService['deleteOneById'] = async (id) => {
    try {
      const user = await this.userRepository.deleteOneById(id)
      return user
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError(`User with id "${id}" was not found`)
      }

      logger.error(error.stack)
      throw ServerError('Error while deleting user')
    }
  }
}

export default new UserService()
