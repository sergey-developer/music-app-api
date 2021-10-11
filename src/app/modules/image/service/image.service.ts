import { isNotFoundDBError } from 'database/utils/errors'
import { IImageRepository, ImageRepository } from 'modules/image/repository'
import { IImageService } from 'modules/image/service'
import {
  isEmptyFilterError,
  isValidationError,
} from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  isBadRequestError,
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

      throw ServerError(`Error while deleting image by id "${id}"`)
    }
  }

  public deleteMany: IImageRepository['deleteMany'] = async (filter) => {
    try {
      await this.imageRepository.deleteMany(filter)
    } catch (error) {
      if (isBadRequestError(error) && isEmptyFilterError(error.kind)) {
        throw BadRequestError(
          'Deleting many images with empty filter forbidden',
        )
      }

      throw ServerError('Error while deleting many images')
    }
  }
}

export default new ImageService()
