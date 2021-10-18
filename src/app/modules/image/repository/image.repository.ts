import isEmpty from 'lodash/isEmpty'
import { FilterQuery } from 'mongoose'

import { appConfig } from 'configs/app'
import { IImageDocument, IImageModel, ImageModel } from 'modules/image/model'
import { IImageRepository } from 'modules/image/repository'
import { omitUndefined } from 'shared/utils/common'
import { deleteFile } from 'shared/utils/file'

class ImageRepository implements IImageRepository {
  private readonly image: IImageModel
  private readonly imageUploadPath: string

  public constructor() {
    this.image = ImageModel
    this.imageUploadPath = appConfig.imageUploadPath
  }

  public findOneById: IImageRepository['findOneById'] = async (id) => {
    return this.image.findById(id).orFail().exec()
  }

  public createOne: IImageRepository['createOne'] = async (payload) => {
    const image = new this.image(payload)
    return image.save()
  }

  public deleteOne: IImageRepository['deleteOne'] = async (id, filename) => {
    const image = await this.image.findByIdAndDelete(id).orFail().exec()
    await deleteFile(this.imageUploadPath, filename)
    return image
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
