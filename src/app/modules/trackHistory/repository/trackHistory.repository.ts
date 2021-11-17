import isEmpty from 'lodash/isEmpty'
import { FilterQuery } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import { EntityNamesEnum } from 'database/constants/entityNames'
import getModelName from 'database/utils/getModelName'
import {
  ITrackHistoryDocument,
  ITrackHistoryModel,
} from 'modules/trackHistory/model'
import { ITrackHistoryRepository } from 'modules/trackHistory/repository'
import { omitUndefined } from 'shared/utils/common'

@singleton()
class TrackHistoryRepository implements ITrackHistoryRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.TrackHistory))
    private readonly trackHistory: ITrackHistoryModel,
  ) {}

  public findAllWhere: ITrackHistoryRepository['findAllWhere'] = async (
    filter,
  ) => {
    return this.trackHistory.find(filter).exec()
  }

  public createOne: ITrackHistoryRepository['createOne'] = async (payload) => {
    const trackHistory = new this.trackHistory(payload)
    return trackHistory.save()
  }

  public deleteOne: ITrackHistoryRepository['deleteOne'] = async (filter) => {
    const { id } = omitUndefined(filter)

    const filterById: FilterQuery<ITrackHistoryDocument> = id ? { _id: id } : {}
    const filterToApply: FilterQuery<ITrackHistoryDocument> = { ...filterById }

    return this.trackHistory.findOneAndDelete(filterToApply).orFail().exec()
  }

  public deleteMany: ITrackHistoryRepository['deleteMany'] = async (filter) => {
    const { trackIds } = omitUndefined(filter)

    const filterByTrack: FilterQuery<ITrackHistoryDocument> = isEmpty(trackIds)
      ? {}
      : { track: { $in: trackIds } }

    const filterToApply: FilterQuery<ITrackHistoryDocument> = {
      ...filterByTrack,
    }

    return this.trackHistory.deleteMany(filterToApply).exec()
  }
}

export default TrackHistoryRepository
