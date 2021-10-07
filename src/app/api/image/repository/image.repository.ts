import { IImageModel, ImageModel } from 'api/image/model'
import { IImageRepository } from 'api/image/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import { createNotFoundError } from 'shared/utils/errors/httpErrors'

class ImageRepository implements IImageRepository {
  private readonly image: IImageModel

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
      const deletedImage = await this.image
        .findByIdAndDelete(id)
        .orFail()
        .exec()

      return deletedImage
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? createNotFoundError() : error
    }
  }

  public deleteMany: IImageRepository['deleteMany'] = async (filter) => {
    try {
      const filterById = filter.ids?.length ? { _id: { $in: filter.ids } } : {}
      await this.image.deleteMany({ ...filterById })
    } catch (error) {
      throw error
    }
  }
}

export default new ImageRepository()
