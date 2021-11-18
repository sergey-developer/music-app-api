import isEmpty from 'lodash/isEmpty'
import { FilterQuery, Error as MongooseError } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import DatabaseError from 'database/errors'
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
      return this.trackHistory.find(filter).exec()
    } catch (error: any) {
      throw new DatabaseError.UnknownError(error.message)
    }
  }

  public createOne: ITrackHistoryRepository['createOne'] = async (payload) => {
    try {
      const trackHistory = new this.trackHistory(payload)
      return trackHistory.save()
    } catch (error: any) {
      if (error instanceof MongooseError.ValidationError) {
        throw new DatabaseError.ValidationError(
          error.message,
          getValidationErrors(
            error.errors as Record<string, MongooseError.ValidatorError>,
          ),
        )
      }

      throw new DatabaseError.UnknownError(error.message)
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

      return this.trackHistory.findOneAndDelete(filterToApply).orFail().exec()
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseError.NotFoundError(error.message)
      }

      throw new DatabaseError.UnknownError(error.message)
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

      return this.trackHistory.deleteMany(filterToApply).exec()
    } catch (error: any) {
      throw new DatabaseError.UnknownError(error.message)
    }
  }
}

export default TrackHistoryRepository
