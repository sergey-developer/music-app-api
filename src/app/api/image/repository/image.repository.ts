import { ImageModel } from 'api/image/model'
import { IImageRepository } from 'api/image/repository'

class ImageRepository implements IImageRepository {
  private readonly image: typeof ImageModel

  public constructor() {
    this.image = ImageModel
  }

  public createOne: IImageRepository['createOne'] = async (payload) => {
    const newArtist = new this.image({
      src: payload.path,
      fileName: payload.filename,
      originalName: payload.originalname,
    })

    return newArtist.save()
  }

  public deleteOneById: IImageRepository['deleteOneById'] = async (id) => {
    try {
      await this.image.findByIdAndDelete(id).orFail()
    } catch (error) {
      throw error
      // TODO: throw custom not found if not found
    }
  }
}

export default new ImageRepository()
