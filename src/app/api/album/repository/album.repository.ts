import isEmpty from 'lodash/isEmpty'
import { FilterQuery } from 'mongoose'

import { AlbumModel, IAlbumDocument, IAlbumModel } from 'api/album/model'
import { IAlbumRepository } from 'api/album/repository'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { omitUndefined } from 'shared/utils/common'
import { badRequestError } from 'shared/utils/errors/httpErrors'

class AlbumRepository implements IAlbumRepository {
  private readonly album: IAlbumModel

  public constructor() {
    this.album = AlbumModel
  }

  public findAll: IAlbumRepository['findAll'] = async () => {
    return this.album.find().exec()
  }

  public findAllWhere: IAlbumRepository['findAllWhere'] = async (filter) => {
    const { artist }: typeof filter = omitUndefined(filter)

    const filterByArtist: FilterQuery<IAlbumDocument> = artist ? { artist } : {}
    const filterToApply: FilterQuery<IAlbumDocument> = { ...filterByArtist }

    return this.album.find(filterToApply).exec()
  }

  public createOne: IAlbumRepository['createOne'] = async (payload) => {
    const album = new this.album(payload)
    return album.save()
  }

  public findOneById: IAlbumRepository['findOneById'] = async (id) => {
    return this.album.findById(id).orFail().exec()
  }

  public deleteOneById: IAlbumRepository['deleteOneById'] = async (id) => {
    return this.album.findByIdAndDelete(id).orFail().exec()
  }

  public deleteMany: IAlbumRepository['deleteMany'] = async (filter) => {
    const { ids }: typeof filter = omitUndefined(filter)

    const filterById: FilterQuery<IAlbumDocument> = isEmpty(ids)
      ? {}
      : { _id: { $in: ids } }

    const filterToApply: FilterQuery<IAlbumDocument> = { ...filterById }

    if (isEmpty(filterToApply)) {
      throw badRequestError(null, {
        kind: ErrorKindsEnum.EmptyFilter,
      })
    }

    await this.album.deleteMany(filterToApply)
  }
}

export default new AlbumRepository()
