import isEmpty from 'lodash/isEmpty'
import { FilterQuery, QueryOptions } from 'mongoose'

import { IImageDocument, IImageModel, ImageModel } from 'modules/image/model'
import { IImageRepository } from 'modules/image/repository'
import { omitUndefined } from 'shared/utils/common'

class ImageRepository implements IImageRepository {
  private readonly image: IImageModel

  public constructor() {
    this.image = ImageModel
  }

  public findOneById: IImageRepository['findOneById'] = async (id) => {
    return this.image.findById(id).orFail().exec()
  }

  public createOne: IImageRepository['createOne'] = async (payload) => {
    const image = new this.image(payload)
    return image.save()
  }

  public updateOne: IImageRepository['updateOne'] = async (filter, payload) => {
    const { id } = omitUndefined(filter)
    const updates = omitUndefined(payload)

    const defaultOptions: QueryOptions = { runValidators: true, new: true }
    const optionsToApply: QueryOptions = defaultOptions

    const filterById: FilterQuery<IImageDocument> = id ? { _id: id } : {}
    const filterToApply: FilterQuery<IImageDocument> = { ...filterById }

    return this.image
      .findOneAndUpdate(filterToApply, updates, optionsToApply)
      .orFail()
      .exec()
  }

  public deleteOne: IImageRepository['deleteOne'] = async (filter) => {
    const { id, fileName }: typeof filter = omitUndefined(filter)

    const filterById: FilterQuery<IImageDocument> = id ? { _id: id } : {}
    const filterByName: FilterQuery<IImageDocument> = fileName
      ? { fileName }
      : {}

    const filterToApply: FilterQuery<IImageDocument> = {
      ...filterById,
      ...filterByName,
    }

    const image = await this.image
      .findOneAndDelete(filterToApply)
      .orFail()
      .exec()

    return image
  }

  public deleteMany: IImageRepository['deleteMany'] = async (filter) => {
    const { ids, fileNames }: typeof filter = omitUndefined(filter)

    const filterById: FilterQuery<IImageDocument> = isEmpty(ids)
      ? {}
      : { _id: { $in: ids } }

    const filterByFileName: FilterQuery<IImageDocument> = isEmpty(fileNames)
      ? {}
      : { fileName: { $in: fileNames } }

    const filterToApply: FilterQuery<IImageDocument> = {
      ...filterById,
      ...filterByFileName,
    }

    await this.image.deleteMany(filterToApply)
  }
}

export default new ImageRepository()
