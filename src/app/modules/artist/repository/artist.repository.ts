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

  public findAll: IArtistRepository['findAll'] = async () => {
    return this.artist.find().exec()
  }

  public findAllWhere: IArtistRepository['findAllWhere'] = async (filter) => {
    const { ids }: typeof filter = omitUndefined(filter)

    const filterById: FilterQuery<IArtistDocument> = isEmpty(ids)
      ? {}
      : { _id: { $in: ids } }

    const filterToApply: FilterQuery<IArtistDocument> = { ...filterById }

    return this.artist.find(filterToApply).exec()
  }

  public create: IArtistRepository['create'] = async (payload) => {
    const artist = new this.artist(payload)
    return artist.save()
  }

  public deleteOneById: IArtistRepository['deleteOneById'] = async (id) => {
    return this.artist.findByIdAndDelete(id).orFail().exec()
  }
}

export default new ArtistRepository()
