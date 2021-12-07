import { FilterQuery, Error as MongooseError } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import { omitUndefined } from 'app/utils/common'
import {
  DatabaseNotFoundError,
  DatabaseUnknownError,
  DatabaseValidationError,
} from 'database/errors'
import { ISessionModel } from 'database/models/session'
import { IUserDocument } from 'database/models/user'
import { getValidationErrors } from 'database/utils/errors'
import { DiTokenEnum } from 'lib/dependency-injection'
import { ISessionRepository } from 'modules/session/repository'

@singleton()
class SessionRepository implements ISessionRepository {
  public constructor(
    @inject(DiTokenEnum.Session)
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
