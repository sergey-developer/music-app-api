import isEmpty from 'lodash/isEmpty'

import { appConfig } from 'configs/app'
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
  isServerError,
} from 'shared/utils/errors/httpErrors'
import { deleteFile } from 'shared/utils/file'

class ImageService implements IImageService {
  private readonly imageRepository: IImageRepository
  private readonly imageUploadPath: string

  public constructor() {
    this.imageRepository = ImageRepository
    this.imageUploadPath = appConfig.imageUploadPath
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

  public updateByName: IImageService['updateByName'] = async (
    fileName,
    payload,
  ) => {
    const serverErrorMsg = 'Error while updating image'

    try {
      await this.deleteByName(fileName)
    } catch (error) {
      logger.warn(error.stack, {
        message: 'Delete image error',
        args: { fileName },
      })

      try {
        await this.deleteByName(payload.filename)
      } catch (error) {
        logger.warn(error.stack, {
          message: 'Delete image error',
          args: { fileName: payload.filename },
        })
      }

      throw isServerError(error) ? ServerError(serverErrorMsg) : error
    }

    try {
      const image = await this.createOne(payload)
      return image
    } catch (error) {
      logger.error(error.stack, {
        message: 'Create image error',
        args: { payload },
      })

      throw isServerError(error) ? ServerError(serverErrorMsg) : error
    }
  }

  public deleteByName: IImageService['deleteByName'] = async (fileName) => {
    try {
      await deleteFile(this.imageUploadPath, fileName)
    } catch (error) {
      throw NotFoundError('Image was not found')
    }

    try {
      const image = await this.imageRepository.deleteOne({ fileName })
      return image
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError('Image was not found')
      }

      logger.error(error.stack)
      throw ServerError('Error while deleting image')
    }
  }

  public deleteMany: IImageService['deleteMany'] = async (rawFilter) => {
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
