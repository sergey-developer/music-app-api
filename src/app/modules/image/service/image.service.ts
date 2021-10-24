import config from 'config'
import isEmpty from 'lodash/isEmpty'

import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
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
} from 'shared/utils/errors/httpErrors'
import { deleteFileFromFs } from 'shared/utils/file'

class ImageService implements IImageService {
  private readonly imageRepository: IImageRepository
  private readonly imageUploadPath: string

  public constructor() {
    this.imageRepository = ImageRepository
    this.imageUploadPath = config.get('app.uploads.imagesDir')
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
      const { filename, originalname } = payload

      const image = await this.imageRepository.createOne({
        src: filename,
        fileName: filename,
        originalName: originalname,
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

  public updateOne: IImageService['updateOne'] = async (filter, payload) => {
    const { id, currentFileName } = filter

    let updatedImage: IImageDocument

    try {
      const { filename, originalname } = payload

      updatedImage = await this.imageRepository.updateOne(
        { id },
        {
          src: filename,
          fileName: filename,
          originalName: originalname,
        },
      )
    } catch (error) {
      if (isValidationError(error.name)) {
        throw BadRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      if (isNotFoundDBError(error)) {
        throw NotFoundError('Image was not found')
      }

      logger.error(error.stack)
      throw ServerError('Error while updating image')
    }

    await deleteFileFromFs(this.imageUploadPath, currentFileName)

    return updatedImage
  }

  // TODO: делать deleteFile при удалении нескольких
  public deleteOneById: IImageService['deleteOneById'] = async (id) => {
    let image: IImageDocument

    try {
      image = await this.imageRepository.deleteOne({ id })
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError('Image was not found')
      }

      logger.error(error.stack)
      throw ServerError('Error while deleting image')
    }

    await deleteFileFromFs(this.imageUploadPath, image.fileName)

    return image
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
