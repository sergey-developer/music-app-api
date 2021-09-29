import { IImageRepository, ImageRepository } from 'api/image/repository'
import { IImageService } from 'api/image/service'

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
      throw error
    }
  }

  public deleteOneById: IImageService['deleteOneById'] = async (id) => {
    try {
      return this.imageRepository.deleteOneById(id)
    } catch (error) {
      throw error
    }
  }
}

export default new ImageService()
