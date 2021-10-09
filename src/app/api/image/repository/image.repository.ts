import isEmpty from 'lodash/isEmpty'

import { IImageModel, ImageModel } from 'api/image/model'
import { IImageRepository } from 'api/image/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { omitUndefined } from 'shared/utils/common'
import {
  badRequestError,
  isBadRequestError,
  notFoundError,
  serverError,
} from 'shared/utils/errors/httpErrors'

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
    try {
      const deletedImage = await this.image
        .findByIdAndDelete(id)
        .orFail()
        .exec()

      return deletedImage
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? notFoundError() : error
    }
  }

  public deleteMany: IImageRepository['deleteMany'] = async (filter) => {
    try {
      const { ids }: typeof filter = omitUndefined(filter)

      const filterById = isEmpty(ids) ? {} : { _id: { $in: ids } }
      const filterToApply = { ...filterById }

      if (isEmpty(filterToApply)) {
        throw badRequestError(null, {
          kind: ErrorKindsEnum.EmptyFilter,
        })
      }

      await this.image.deleteMany(filterToApply)
    } catch (error) {
      throw isBadRequestError(error) ? error : serverError()
    }
  }
}

export default new ImageRepository()
