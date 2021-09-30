import _isEmpty from 'lodash/isEmpty'

import { TrackHistoryModel } from 'api/trackHistory/model'
import { ITrackHistoryRepository } from 'api/trackHistory/repository'

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

  public deleteMany: ITrackHistoryRepository['deleteMany'] = async (filter) => {
    if (_isEmpty(filter)) return

    const filterByTrack = _isEmpty(filter.tracksIds)
      ? {}
      : { track: { $in: filter.tracksIds! } }

    const deleteManyFilter = { ...filterByTrack }

    if (_isEmpty(deleteManyFilter)) return

    try {
      await this.trackHistory.deleteMany(deleteManyFilter)
    } catch (error) {
      throw error
    }
  }
}

export default new TrackHistoryRepository()
