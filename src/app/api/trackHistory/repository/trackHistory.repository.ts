import isEmpty from 'lodash/isEmpty'
import { FilterQuery } from 'mongoose'

import {
  ITrackHistoryDocument,
  ITrackHistoryModel,
  TrackHistoryModel,
} from 'api/trackHistory/model'
import { ITrackHistoryRepository } from 'api/trackHistory/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { omitUndefined } from 'shared/utils/common'
import {
  badRequestError,
  isBadRequestError,
  notFoundError,
  serverError,
} from 'shared/utils/errors/httpErrors'

class TrackHistoryRepository implements ITrackHistoryRepository {
  private readonly trackHistory: ITrackHistoryModel

  public constructor() {
    this.trackHistory = TrackHistoryModel
  }

  public findAllWhere: ITrackHistoryRepository['findAllWhere'] = async (
    filter,
  ) => {
    return this.trackHistory.find(filter).exec()
  }

  public createOne: ITrackHistoryRepository['createOne'] = async (payload) => {
    const trackHistory = new this.trackHistory(payload)
    return trackHistory.save()
  }

  public deleteOneById: ITrackHistoryRepository['deleteOneById'] = async (
    id,
  ) => {
    try {
      const deletedTrackHistory = await this.trackHistory
        .findByIdAndDelete(id)
        .orFail()
        .exec()

      return deletedTrackHistory
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? notFoundError() : error
    }
  }

  public deleteMany: ITrackHistoryRepository['deleteMany'] = async (filter) => {
    try {
      const { trackIds }: typeof filter = omitUndefined(filter)

      const filterByTrack: FilterQuery<ITrackHistoryDocument> = isEmpty(
        trackIds,
      )
        ? {}
        : { track: { $in: trackIds } }

      const filterToApply: FilterQuery<ITrackHistoryDocument> = {
        ...filterByTrack,
      }

      if (isEmpty(filterToApply)) {
        throw badRequestError(null, {
          kind: ErrorKindsEnum.EmptyFilter,
        })
      }

      await this.trackHistory.deleteMany(filterToApply)
    } catch (error) {
      throw isBadRequestError(error) ? error : serverError()
    }
  }
}

export default new TrackHistoryRepository()
