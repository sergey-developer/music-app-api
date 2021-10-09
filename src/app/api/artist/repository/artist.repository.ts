import isEmpty from 'lodash/isEmpty'
import { FilterQuery } from 'mongoose'

import { ArtistModel, IArtistDocument, IArtistModel } from 'api/artist/model'
import { IArtistRepository } from 'api/artist/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import { omitUndefined } from 'shared/utils/common'
import { notFoundError } from 'shared/utils/errors/httpErrors'

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

  public createOne: IArtistRepository['createOne'] = async (payload) => {
    const artist = new this.artist(payload)
    return artist.save()
  }

  public deleteOneById: IArtistRepository['deleteOneById'] = async (id) => {
    try {
      const deletedArtist = await this.artist
        .findByIdAndDelete(id)
        .orFail()
        .exec()

      return deletedArtist
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? notFoundError() : error
    }
  }
}

export default new ArtistRepository()
