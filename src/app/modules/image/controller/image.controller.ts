import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'

import { IImageController } from 'modules/image/controller'
import { IImageService, ImageService } from 'modules/image/service'
import {
  BadRequestError,
  ensureHttpError,
} from 'shared/utils/errors/httpErrors'

class ImageController implements IImageController {
  private readonly imageService: IImageService

  constructor() {
    this.imageService = ImageService
  }

  public createOne: IImageController['createOne'] = async (req, res) => {
    const file = req.file

    try {
      if (!file) throw BadRequestError('File was not provided')

      const image = await this.imageService.createOne(file)
      const result = pick(image, 'id', 'src')

      res.status(StatusCodes.CREATED).send({ data: result })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public deleteOne: IImageController['deleteOne'] = async (req, res) => {
    const imageId = req.params.id

    try {
      await this.imageService.deleteOneById(imageId)

      res.sendStatus(StatusCodes.OK)
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new ImageController()
