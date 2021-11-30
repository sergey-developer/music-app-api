import { delay, inject, singleton } from 'tsyringe'

import { VALIDATION_ERR_MSG } from 'app/constants/messages/errors'
import {
  isDatabaseNotFoundError,
  isDatabaseValidationError,
} from 'database/errors'
import logger from 'lib/logger'
import { UserRepository } from 'modules/user/repository'
import { IUserService } from 'modules/user/service'
import {
  AppNotFoundError,
  AppUnknownError,
  AppValidationError,
} from 'app/utils/errors/appErrors'

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
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError(`User with email "${email}" was not found`)
      }

      logger.error(error.stack)
      throw new AppUnknownError('Error while getting user')
    }
  }

  public createOne: IUserService['createOne'] = async (payload) => {
    try {
      const user = await this.userRepository.createOne(payload)
      return user
    } catch (error: any) {
      if (isDatabaseValidationError(error)) {
        throw new AppValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack)
      throw new AppUnknownError('Error while creating new user')
    }
  }

  public deleteOneById: IUserService['deleteOneById'] = async (id) => {
    try {
      const user = await this.userRepository.deleteOne({ id })
      return user
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('User was not found')
      }

      logger.error(error.stack)
      throw new AppUnknownError('Error while deleting user')
    }
  }
}

export default UserService
