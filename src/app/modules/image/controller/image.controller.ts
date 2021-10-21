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
    try {
      const file = req.file

      if (!file) throw BadRequestError('File was not provided')

      const image = await this.imageService.createOne(file)
      const result = pick(image, 'id', 'src', 'fileName')

      res.status(StatusCodes.CREATED).send({ data: result })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public updateOne: IImageController['updateOne'] = async (req, res) => {
    try {
      const file = req.file

      if (!file) throw BadRequestError('File was not provided')

      const { id } = req.params
      const { currentFileName } = req.body

      const image = await this.imageService.updateOne(
        { id, currentFileName },
        file,
      )

      const result = pick(image, 'src', 'fileName')

      res.status(StatusCodes.OK).send({ data: result })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public deleteOne: IImageController['deleteOne'] = async (req, res) => {
    const { id } = req.params

    try {
      await this.imageService.deleteOneById(id)
      res.sendStatus(StatusCodes.NO_CONTENT)
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new ImageController()
