import isEmpty from 'lodash/isEmpty'

import { IImageModel, ImageModel } from 'api/image/model'
import { IImageRepository } from 'api/image/repository'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { omitUndefined } from 'shared/utils/common'
import { badRequestError } from 'shared/utils/errors/httpErrors'

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

    const filterById = isEmpty(ids) ? {} : { _id: { $in: ids } }
    const filterToApply = { ...filterById }

    if (isEmpty(filterToApply)) {
      throw badRequestError(null, {
        kind: ErrorKindsEnum.EmptyFilter,
      })
    }

    await this.image.deleteMany(filterToApply)
  }
}

export default new ImageRepository()
