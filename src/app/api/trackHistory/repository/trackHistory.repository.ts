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
}

export default new TrackHistoryRepository()
