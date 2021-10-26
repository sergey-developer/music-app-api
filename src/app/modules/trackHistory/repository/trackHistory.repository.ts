import isEmpty from 'lodash/isEmpty'
import { FilterQuery } from 'mongoose'
import { singleton } from 'tsyringe'

import {
  ITrackHistoryDocument,
  ITrackHistoryModel,
  TrackHistoryModel,
} from 'modules/trackHistory/model'
import { ITrackHistoryRepository } from 'modules/trackHistory/repository'
import { omitUndefined } from 'shared/utils/common'

@singleton()
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
    return this.trackHistory.findByIdAndDelete(id).orFail().exec()
  }

  public deleteMany: ITrackHistoryRepository['deleteMany'] = async (filter) => {
    const { trackIds }: typeof filter = omitUndefined(filter)

    const filterByTrack: FilterQuery<ITrackHistoryDocument> = isEmpty(trackIds)
      ? {}
      : { track: { $in: trackIds } }

    const filterToApply: FilterQuery<ITrackHistoryDocument> = {
      ...filterByTrack,
    }

    await this.trackHistory.deleteMany(filterToApply)
  }
}

export default TrackHistoryRepository
