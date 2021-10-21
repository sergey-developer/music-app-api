import isEmpty from 'lodash/isEmpty'
import { FilterQuery } from 'mongoose'

import {
  ArtistModel,
  IArtistDocument,
  IArtistModel,
} from 'modules/artist/model'
import { IArtistRepository } from 'modules/artist/repository'
import { omitUndefined } from 'shared/utils/common'

class ArtistRepository implements IArtistRepository {
  private readonly artist: IArtistModel

  public constructor() {
    this.artist = ArtistModel
  }

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

    const filterById: FilterQuery<IArtistDocument> = id ? { _id: id } : {}
    const filterToApply: FilterQuery<IArtistDocument> = { ...filterById }

    return this.artist.findOneAndUpdate(filterToApply, updates).orFail().exec()
  }

  public deleteOneById: IArtistRepository['deleteOneById'] = async (id) => {
    return this.artist
      .findOneAndDelete({ _id: id })
      .orFail()
      .populate('photo')
      .exec()
  }
}

export default new ArtistRepository()
