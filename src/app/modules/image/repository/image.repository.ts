import isEmpty from 'lodash/isEmpty'
import { FilterQuery } from 'mongoose'

import { IImageDocument, IImageModel, ImageModel } from 'modules/image/model'
import { IImageRepository } from 'modules/image/repository'
import { omitUndefined } from 'shared/utils/common'

class ImageRepository implements IImageRepository {
  private readonly image: IImageModel

  public constructor() {
    this.image = ImageModel
  }

  public createOne: IImageRepository['createOne'] = async (payload) => {
    const image = new this.image({
      src: payload.path,
      fileName: payload.filename,
      originalName: payload.originalname,
    })

    return image.save()
  }

  public deleteOneById: IImageRepository['deleteOneById'] = async (id) => {
    return this.image.findByIdAndDelete(id).orFail().exec()
  }

  public deleteMany: IImageRepository['deleteMany'] = async (filter) => {
    const { ids }: typeof filter = omitUndefined(filter)

    const filterById: FilterQuery<IImageDocument> = isEmpty(ids)
      ? {}
      : { _id: { $in: ids } }

    const filterToApply: FilterQuery<IImageDocument> = { ...filterById }

    await this.image.deleteMany(filterToApply)
  }
}

export default new ImageRepository()
