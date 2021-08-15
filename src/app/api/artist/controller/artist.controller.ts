import { Response } from 'express'
import StatusCodes from 'http-status-codes'

import { IArtistController } from 'api/artist/controller'
import { CreateArtistDto } from 'api/artist/dto'
import { ArtistService, IArtistService } from 'api/artist/service'
import { Request } from 'shared/interface/request'

class ArtistController implements IArtistController {
  private readonly artistService: IArtistService

  constructor() {
    this.artistService = ArtistService
  }

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const allArtists = await this.artistService.getAll()

      res.send({ data: allArtists })
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: error.message })
    }
  }

  createOne = async (
    req: Request<CreateArtistDto>,
    res: Response,
  ): Promise<void> => {
    try {
      const createdArtist = await this.artistService.createOne(req.body)

      res.send({ data: { id: createdArtist.id } })
    } catch (error) {
      res.status(error.statusCode).send(error)
    }
  }
}

export default new ArtistController()
