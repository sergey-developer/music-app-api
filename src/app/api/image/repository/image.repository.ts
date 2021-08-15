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
    await this.image.deleteOne({ id })
    // TODO: если не нашёл, то нет ошибки, исправить это
  }
}

export default new ImageRepository()
