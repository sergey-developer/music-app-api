import { delay, inject, singleton } from 'tsyringe'

import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import { UserRepository } from 'modules/user/repository'
import { IUserService } from 'modules/user/service'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import { NotFoundError, ServerError } from 'shared/utils/errors/httpErrors'
import { ValidationError } from 'shared/utils/errors/validationErrors'

@singleton()
class UserService implements IUserService {
  public constructor(
    @inject(delay(() => UserRepository))
    private readonly userRepository: UserRepository,
  ) {}

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

  public createOne: IUserService['createOne'] = async (payload) => {
    try {
      const user = await this.userRepository.createOne(payload)
      return user
    } catch (error) {
      if (isValidationError(error.name)) {
        throw ValidationError(null, error)
      }

      logger.error(error.stack)
      throw ServerError('Error while creating new user')
    }
  }

  public deleteOneById: IUserService['deleteOneById'] = async (id) => {
    try {
      const user = await this.userRepository.deleteOneById(id)
      return user
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError('User was not found')
      }

      logger.error(error.stack)
      throw ServerError('Error while deleting user')
    }
  }
}

export default UserService
