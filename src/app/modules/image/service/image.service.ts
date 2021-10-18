import isEmpty from 'lodash/isEmpty'

import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import { IArtistService } from 'modules/artist/service'
import { IImageDocument } from 'modules/image/model'
import { IImageRepository, ImageRepository } from 'modules/image/repository'
import { IImageService } from 'modules/image/service'
import { EMPTY_FILTER_ERR_MSG } from 'shared/constants/errorMessages'
import { omitUndefined } from 'shared/utils/common'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  isNotFoundError,
  isServerError,
} from 'shared/utils/errors/httpErrors'

class ImageService implements IImageService {
  private readonly imageRepository: IImageRepository

  constructor() {
    this.imageRepository = ImageRepository
  }

  public getOneById: IImageService['getOneById'] = async (id) => {
    try {
      const image = await this.imageRepository.findOneById(id)
      return image
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError('Image was not found')
      }

      logger.error(error.stack)
      throw ServerError('Error while getting image')
    }
  }

  public createOne: IImageService['createOne'] = async (payload) => {
    try {
      const image = await this.imageRepository.createOne({
        src: payload.filename,
        fileName: payload.filename,
        originalName: payload.originalname,
      })
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

  public updateById: IImageService['updateById'] = async (id, payload) => {
    const serverErrorMsg = 'Error while updating image'

    try {
      await this.deleteOneById(id)
    } catch (error) {
      logger.error(error.stack, {
        message: 'Update image error',
        args: { id },
      })

      throw isServerError(error) ? ServerError(serverErrorMsg) : error
    }

    try {
      const image = await this.createOne(payload)
      return image
    } catch (error) {
      logger.error(error.stack, {
        message: 'Update image error',
        args: { id, payload },
      })

      throw isServerError(error) ? ServerError(serverErrorMsg) : error
    }
  }

  public deleteOneById: IImageService['deleteOneById'] = async (id) => {
    const serverErrorMsg = 'Error while deleting image'
    let imageToDelete: IImageDocument

    try {
      imageToDelete = await this.getOneById(id)
    } catch (error) {
      logger.error(error.stack, {
        message: 'Delete image error',
        args: { id },
      })

      throw ServerError(serverErrorMsg)
    }

    try {
      const { id, fileName } = imageToDelete
      const image = await this.imageRepository.deleteOne(id, fileName)
      return image
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError('Image was not found')
      }

      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
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
