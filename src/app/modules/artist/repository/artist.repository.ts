import isEmpty from 'lodash/isEmpty'
import { FilterQuery, QueryOptions } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import { EntityNamesEnum } from 'database/constants/entityNames'
import getModelName from 'database/utils/getModelName'
import { IArtistDocument, IArtistModel } from 'modules/artist/model'
import { IArtistRepository } from 'modules/artist/repository'
import { omitUndefined } from 'shared/utils/common'

@singleton()
class ArtistRepository implements IArtistRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.Artist))
    private readonly artist: IArtistModel,
  ) {}

  public findAllWhere: IArtistRepository['findAllWhere'] = async (filter) => {
    const { ids }: typeof filter = omitUndefined(filter)

    const filterById: FilterQuery<IArtistDocument> = isEmpty(ids)
      ? {}
      : { _id: { $in: ids } }

    const filterToApply: FilterQuery<IArtistDocument> = { ...filterById }

    return this.artist.find(filterToApply).exec()
  }

  public findOneById: IArtistRepository['findOneById'] = async (id) => {
    return this.artist.findById(id).orFail().exec()
  }

  public createOne: IArtistRepository['createOne'] = async (payload) => {
    const artist = new this.artist(payload)
    return artist.save()
  }

  public updateOne: IArtistRepository['updateOne'] = async (
    filter,
    payload,
  ) => {
    const { id } = omitUndefined(filter)
    const updates = omitUndefined(payload)

    const defaultOptions: QueryOptions = {
      runValidators: true,
      new: true,
      context: 'query',
    }
    const optionsToApply: QueryOptions = defaultOptions

    const filterById: FilterQuery<IArtistDocument> = id ? { _id: id } : {}
    const filterToApply: FilterQuery<IArtistDocument> = { ...filterById }

    return this.artist
      .findOneAndUpdate(filterToApply, updates, optionsToApply)
      .orFail()
      .exec()
  }

  public deleteOneById: IArtistRepository['deleteOneById'] = async (id) => {
    return this.artist
      .findOneAndDelete({ _id: id })
      .orFail()
      .populate('photo')
      .exec()
  }
}

export default ArtistRepository
