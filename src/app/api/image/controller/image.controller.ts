import StatusCodes from 'http-status-codes'

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

        res.send({ data: image })
        return
      }

      throw new Error('handle error') // TODO: refactor
    } catch (error) {
      res.status(500).send(error)
    }
  }

  public deleteOneById: IImageController['deleteOneById'] = async (
    req,
    res,
  ) => {
    try {
      await this.imageService.deleteOneById(req.params.id)

      res.status(StatusCodes.OK)
    } catch (error) {
      console.log({ error })
      res.status(500).send(error)
    }
  }
}

export default new ImageController()
