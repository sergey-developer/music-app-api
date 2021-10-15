import isEmpty from 'lodash/isEmpty'

import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import { IImageRepository, ImageRepository } from 'modules/image/repository'
import { IImageService } from 'modules/image/service'
import { EMPTY_FILTER_ERR_MSG } from 'shared/constants/errorMessages'
import { omitUndefined } from 'shared/utils/common'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
} from 'shared/utils/errors/httpErrors'

class ImageService implements IImageService {
  private readonly imageRepository: IImageRepository

  constructor() {
    this.imageRepository = ImageRepository
  }

  public createOne: IImageService['createOne'] = async (payload) => {
    try {
      const image = await this.imageRepository.createOne(payload)
      return image
    } catch (error) {
      if (isValidationError(error.name)) {
        throw BadRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      logger.error(error.stack)
      throw ServerError('Error while creating new image')
    }
  }

  public deleteOneById: IImageService['deleteOneById'] = async (id) => {
    try {
      const image = await this.imageRepository.deleteOneById(id)
      return image
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError(`Image with id "${id}" was not found`)
      }

      logger.error(error.stack)
      throw ServerError(`Error while deleting image by id "${id}"`)
    }
  }

  public deleteMany: IImageRepository['deleteMany'] = async (rawFilter) => {
    const filter: typeof rawFilter = omitUndefined(rawFilter)

    if (isEmpty(filter)) {
      throw BadRequestError(EMPTY_FILTER_ERR_MSG)
    }

    try {
      await this.imageRepository.deleteMany(filter)
    } catch (error) {
      logger.error(error.stack)
      throw ServerError('Error while deleting images')
    }
  }
}

export default new ImageService()
