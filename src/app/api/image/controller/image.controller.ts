import StatusCodes from 'http-status-codes'
import pick from 'lodash/pick'

import { IImageController } from 'api/image/controller'
import { IImageService, ImageService } from 'api/image/service'

class ImageController implements IImageController {
  private readonly imageService: IImageService

  constructor() {
    this.imageService = ImageService
  }

  public createOne: IImageController['createOne'] = async (req, res) => {
    const file = req.file

    try {
      if (file) {
        const image = await this.imageService.createOne(file)
        const response = pick(image, 'id', 'src')

        res.status(StatusCodes.OK).send(response)
        return
      }

      throw new Error('handle error') // TODO: handle error
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }

  public deleteOneById: IImageController['deleteOneById'] = async (
    req,
    res,
  ) => {
    const imageId = req.params.id

    try {
      await this.imageService.deleteOneById(imageId)

      res.sendStatus(StatusCodes.OK)
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }
}

export default new ImageController()
