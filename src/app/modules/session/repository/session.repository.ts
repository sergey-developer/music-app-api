import { FilterQuery, Error as MongooseError } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import {
  DatabaseNotFoundError,
  DatabaseUnknownError,
  DatabaseValidationError,
} from 'database/errors'
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

      const session = await this.session.findOne(filterToApply).orFail().exec()
      return session
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public createOne: ISessionRepository['createOne'] = async (payload) => {
    try {
      const token = this.session.generateToken(payload)
      const newSession = new this.session({
        token,
        user: payload.userId,
      })

      const session = await newSession.save()
      return session
    } catch (error: any) {
      if (error instanceof MongooseError.ValidationError) {
        throw new DatabaseValidationError(
          error.message,
          getValidationErrors(
            error.errors as Record<string, MongooseError.ValidatorError>,
          ),
        )
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public deleteOne: ISessionRepository['deleteOne'] = async (filter) => {
    try {
      const { token } = omitUndefined(filter)

      const filterByToken: FilterQuery<IUserDocument> = token ? { token } : {}
      const filterToApply: FilterQuery<IUserDocument> = { ...filterByToken }

      const session = await this.session
        .findOneAndDelete(filterToApply)
        .orFail()
        .exec()

      return session
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }
}

export default SessionRepository
