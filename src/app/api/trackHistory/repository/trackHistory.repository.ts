import isEmpty from 'lodash/isEmpty'

import { TrackHistoryModel } from 'api/trackHistory/model'
import { ITrackHistoryRepository } from 'api/trackHistory/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import { createNotFoundError } from 'shared/utils/errors/httpErrors'

class TrackHistoryRepository implements ITrackHistoryRepository {
  private readonly trackHistory: typeof TrackHistoryModel

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
      throw isNotFoundDatabaseError(error) ? createNotFoundError() : error
    }
  }

  public deleteMany: ITrackHistoryRepository['deleteMany'] = async (filter) => {
    if (isEmpty(filter)) return

    const filterByTrack = isEmpty(filter.trackIds)
      ? {}
      : { track: { $in: filter.trackIds! } }

    const deleteManyFilter = { ...filterByTrack }

    if (isEmpty(deleteManyFilter)) return

    try {
      await this.trackHistory.deleteMany(deleteManyFilter)
    } catch (error) {
      throw error
    }
  }
}

export default new TrackHistoryRepository()
