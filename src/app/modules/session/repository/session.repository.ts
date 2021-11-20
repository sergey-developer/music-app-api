import { FilterQuery, Error as MongooseError } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import { NotFoundError, UnknownError, ValidationError } from 'database/errors'
import getModelName from 'database/utils/getModelName'
import { ISessionModel } from 'modules/session/model'
import { ISessionRepository } from 'modules/session/repository'
import { IUserDocument } from 'modules/user/model'
import { omitUndefined } from 'shared/utils/common'
import { getValidationErrors } from 'shared/utils/errors/validationErrors'

@singleton()
class SessionRepository implements ISessionRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.Session))
    private readonly session: ISessionModel,
  ) {}

  public findOne: ISessionRepository['findOne'] = async (filter) => {
    try {
      const { token } = omitUndefined(filter)

      const filterByToken: FilterQuery<IUserDocument> = token ? { token } : {}
      const filterToApply: FilterQuery<IUserDocument> = { ...filterByToken }

      return this.session.findOne(filterToApply).orFail().exec()
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new NotFoundError(error.message)
      }

      throw new UnknownError(error.message)
    }
  }

  public createOne: ISessionRepository['createOne'] = async (payload) => {
    try {
      const token = this.session.generateToken(payload)
      const session = new this.session({
        token,
        user: payload.userId,
      })

      return session.save()
    } catch (error: any) {
      if (error instanceof MongooseError.ValidationError) {
        throw new ValidationError(
          error.message,
          getValidationErrors(
            error.errors as Record<string, MongooseError.ValidatorError>,
          ),
        )
      }

      throw new UnknownError(error.message)
    }
  }

  public deleteOne: ISessionRepository['deleteOne'] = async (filter) => {
    try {
      const { token } = omitUndefined(filter)

      const filterByToken: FilterQuery<IUserDocument> = token ? { token } : {}
      const filterToApply: FilterQuery<IUserDocument> = { ...filterByToken }

      return this.session.findOneAndDelete(filterToApply).orFail().exec()
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new NotFoundError(error.message)
      }

      throw new UnknownError(error.message)
    }
  }
}

export default SessionRepository
