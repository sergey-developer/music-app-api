import isEmpty from 'lodash/isEmpty'
import { FilterQuery } from 'mongoose'
import { singleton } from 'tsyringe'

import { AlbumModel, IAlbumDocument, IAlbumModel } from 'modules/album/model'
import { IAlbumRepository } from 'modules/album/repository'
import { omitUndefined } from 'shared/utils/common'

@singleton()
class AlbumRepository implements IAlbumRepository {
  private readonly album: IAlbumModel

  public constructor() {
    this.album = AlbumModel
  }

  public findAllWhere: IAlbumRepository['findAllWhere'] = async (filter) => {
    const { artist, ids }: typeof filter = omitUndefined(filter)

    const filterByArtist: FilterQuery<IAlbumDocument> = artist ? { artist } : {}
    const filterById: FilterQuery<IAlbumDocument> = isEmpty(ids)
      ? {}
      : { _id: { $in: ids } }

    const filterToApply: FilterQuery<IAlbumDocument> = {
      ...filterByArtist,
      ...filterById,
    }

    return this.album.find(filterToApply).exec()
  }

  public findOneById: IAlbumRepository['findOneById'] = async (id) => {
    return this.album.findById(id).orFail().exec()
  }

  public createOne: IAlbumRepository['createOne'] = async (payload) => {
    const album = new this.album(payload)
    return album.save()
  }

  public updateOne: IAlbumRepository['updateOne'] = async (filter, payload) => {
    const { id } = omitUndefined(filter)
    const updates = omitUndefined(payload)

    const filterById: FilterQuery<IAlbumDocument> = id ? { _id: id } : {}
    const filterToApply: FilterQuery<IAlbumDocument> = { ...filterById }

    return this.album.findOneAndUpdate(filterToApply, updates).orFail().exec()
  }

  public deleteOneById: IAlbumRepository['deleteOneById'] = async (id) => {
    return this.album.findOneAndDelete({ _id: id }).orFail().exec()
  }

  public deleteMany: IAlbumRepository['deleteMany'] = async (filter) => {
    const { ids }: typeof filter = omitUndefined(filter)

    const filterById: FilterQuery<IAlbumDocument> = isEmpty(ids)
      ? {}
      : { _id: { $in: ids } }

    const filterToApply: FilterQuery<IAlbumDocument> = { ...filterById }

    await this.album.deleteMany(filterToApply)
  }
}

export default AlbumRepository
