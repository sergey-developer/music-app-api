import isEmpty from 'lodash/isEmpty'
import { FilterQuery, QueryOptions } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import { EntityNamesEnum } from 'database/constants/entityNames'
import getModelName from 'database/utils/getModelName'
import { ITrackDocument, ITrackModel } from 'modules/track/model'
import { ITrackRepository } from 'modules/track/repository'
import { omitUndefined } from 'shared/utils/common'

@singleton()
class TrackRepository implements ITrackRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.Track))
    private readonly track: ITrackModel,
  ) {}

  public findAllWhere: ITrackRepository['findAllWhere'] = async (filter) => {
    const { artist, albumIds, ids }: typeof filter = omitUndefined(filter)

    const filterById: FilterQuery<ITrackDocument> = isEmpty(ids)
      ? {}
      : { _id: { $in: ids } }

    const filterByAlbum: FilterQuery<ITrackDocument> = isEmpty(albumIds)
      ? {}
      : { album: { $in: albumIds } }

    const filterToApply: FilterQuery<ITrackDocument> = {
      ...filterById,
      ...filterByAlbum,
    }

    if (artist) {
      return this.track.findByArtistId(artist, filterToApply)
    }

    return this.track.find(filterToApply).exec()
  }

  public findOneById: ITrackRepository['findOneById'] = async (id) => {
    return this.track.findById(id).orFail().exec()
  }

  public createOne: ITrackRepository['createOne'] = async (payload) => {
    const track = new this.track(payload)
    return track.save()
  }

  public updateOne: ITrackRepository['updateOne'] = async (filter, payload) => {
    const { id } = omitUndefined(filter)
    const updates = omitUndefined(payload)

    const defaultOptions: QueryOptions = {
      runValidators: true,
      new: true,
      context: 'query',
    }
    const optionsToApply: QueryOptions = defaultOptions

    const filterById: FilterQuery<ITrackDocument> = id ? { _id: id } : {}
    const filterToApply: FilterQuery<ITrackDocument> = { ...filterById }

    return this.track
      .findOneAndUpdate(filterToApply, updates, optionsToApply)
      .orFail()
      .exec()
  }

  public deleteOneById: ITrackRepository['deleteOneById'] = async (id) => {
    return this.track.findByIdAndDelete(id).orFail().exec()
  }

  public deleteMany: ITrackRepository['deleteMany'] = async (filter) => {
    const { ids }: typeof filter = omitUndefined(filter)

    const filterById: FilterQuery<ITrackDocument> = isEmpty(ids)
      ? {}
      : { _id: { $in: ids } }

    const filterToApply: FilterQuery<ITrackDocument> = { ...filterById }

    await this.track.deleteMany(filterToApply)
  }
}

export default TrackRepository
