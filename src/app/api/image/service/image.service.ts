import { IImageRepository, ImageRepository } from 'api/image/repository'
import { IImageService } from 'api/image/service'
import { isNotFoundDBError } from 'database/utils/errors'
import {
  isEmptyFilterError,
  isValidationError,
} from 'shared/utils/errors/checkErrorKind'
import {
  badRequestError,
  isBadRequestError,
  notFoundError,
  serverError,
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
        throw badRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      throw serverError('Error while creating new image')
    }
  }

  public deleteOneById: IImageService['deleteOneById'] = async (id) => {
    try {
      const image = await this.imageRepository.deleteOneById(id)
      return image
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw notFoundError(`Image with id "${id}" was not found`)
      }

      throw serverError(`Error while deleting image by id "${id}"`)
    }
  }

  public deleteMany: IImageRepository['deleteMany'] = async (filter) => {
    try {
      await this.imageRepository.deleteMany(filter)
    } catch (error) {
      if (isBadRequestError(error) && isEmptyFilterError(error.kind)) {
        throw badRequestError(
          'Deleting many images with empty filter forbidden',
        )
      }

      throw serverError('Error while deleting many images')
    }
  }
}

export default new ImageService()
