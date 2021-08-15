import { Request, Response } from 'express'

import { IImageController } from 'api/uploads/image/controller'
import { IImageService, ImageService } from 'api/uploads/image/service'

class ImageController implements IImageController {
  private readonly imageService: IImageService

  constructor() {
    this.imageService = ImageService
  }

  createOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const image = await this.imageService.createOne(req.body)

      res.send({ data: image })
    } catch (error) {
      res.status(error.statusCode).send(error)
    }
  }
}

export default new ImageController()
