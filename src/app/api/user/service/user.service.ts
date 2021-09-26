import { IUserRepository, UserRepository } from 'api/user/repository'
import { IUserService } from 'api/user/service'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

class UserService implements IUserService {
  private readonly userRepository: IUserRepository

  public constructor() {
    this.userRepository = UserRepository
  }

  public create: IUserService['create'] = async (payload) => {
    try {
      const user = await this.userRepository.create(payload)
      return user
    } catch (error: any) {
      // TODO: response создавать в контроллере, здесь просто выбрасывать нужную ошибку
      if (error.name === ErrorKindsEnum.ValidationError) {
        throw new BadRequestResponse(error.name, error.message, {
          errors: error.errors,
        })
      }

      throw new ServerErrorResponse(
        ErrorKindsEnum.UnknownServerError,
        'Error was occurred while creating User',
      )
    }
  }

  public getOneByEmail: IUserService['getOneByEmail'] = async (email) => {
    try {
      const user = await this.userRepository.findOneByEmail(email)
      return user
    } catch (error) {
      throw error
    }
  }
}

export default new UserService()
