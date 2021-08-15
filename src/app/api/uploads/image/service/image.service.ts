import { IImageRepository, ImageRepository } from 'api/uploads/image/repository'
import { IImageService } from 'api/uploads/image/service'

class ImageService implements IImageService {
  private readonly imageRepository: IImageRepository

  constructor() {
    this.imageRepository = ImageRepository
  }

  createOne = async (payload: any) => {
    try {
      const image = await this.imageRepository.createOne(payload)

      return image
    } catch (error) {
      throw error
    }
  }
}

export default new ImageService()
