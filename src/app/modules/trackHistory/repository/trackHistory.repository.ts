import isEmpty from 'lodash/isEmpty'
import { FilterQuery, Error as MongooseError } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import {
  DatabaseNotFoundError,
  DatabaseUnknownError,
  DatabaseValidationError,
} from 'database/errors'
import getModelName from 'database/utils/getModelName'
import {
  ITrackHistoryDocument,
  ITrackHistoryModel,
} from 'modules/trackHistory/model'
import { ITrackHistoryRepository } from 'modules/trackHistory/repository'
import { omitUndefined } from 'shared/utils/common'
import { getValidationErrors } from 'shared/utils/errors/validationErrors'

@singleton()
class TrackHistoryRepository implements ITrackHistoryRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.TrackHistory))
    private readonly trackHistory: ITrackHistoryModel,
  ) {}

  public findAllWhere: ITrackHistoryRepository['findAllWhere'] = async (
    filter,
  ) => {
    try {
      const { user } = omitUndefined(filter)

      const filterByUser: FilterQuery<ITrackHistoryDocument> = user
        ? { user }
        : {}

      const filterToApply: FilterQuery<ITrackHistoryDocument> = {
        ...filterByUser,
      }

      const trackHistories = await this.trackHistory.find(filterToApply).exec()

      return trackHistories
    } catch (error: any) {
      throw new DatabaseUnknownError(error.message)
    }
  }

  public createOne: ITrackHistoryRepository['createOne'] = async (payload) => {
    try {
      const newTrackHistory = new this.trackHistory(payload)
      const trackHistory = await newTrackHistory.save()

      return trackHistory
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

  public deleteOne: ITrackHistoryRepository['deleteOne'] = async (filter) => {
    try {
      const { id } = omitUndefined(filter)

      const filterById: FilterQuery<ITrackHistoryDocument> = id
        ? { _id: id }
        : {}

      const filterToApply: FilterQuery<ITrackHistoryDocument> = {
        ...filterById,
      }

      const trackHistory = await this.trackHistory
        .findOneAndDelete(filterToApply)
        .orFail()
        .exec()

      return trackHistory
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public deleteMany: ITrackHistoryRepository['deleteMany'] = async (filter) => {
    try {
      const { trackIds } = omitUndefined(filter)

      const filterByTrack: FilterQuery<ITrackHistoryDocument> = isEmpty(
        trackIds,
      )
        ? {}
        : { track: { $in: trackIds } }

      const filterToApply: FilterQuery<ITrackHistoryDocument> = {
        ...filterByTrack,
      }

      const deletionResult = await this.trackHistory
        .deleteMany(filterToApply)
        .exec()

      return deletionResult
    } catch (error: any) {
      throw new DatabaseUnknownError(error.message)
    }
  }
}

export default TrackHistoryRepository
