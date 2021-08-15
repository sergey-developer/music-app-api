import { ImageModel } from 'api/uploads/image/model'
import { IImageRepository } from 'api/uploads/image/repository'

class ImageRepository implements IImageRepository {
  private readonly image: typeof ImageModel

  public constructor() {
    this.image = ImageModel
  }

  public createOne = async (payload: any) => {
    const newArtist = new this.image(payload)
    return newArtist.save()
  }
}

export default new ImageRepository()
