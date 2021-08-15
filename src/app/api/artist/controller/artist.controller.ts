import { Request, Response } from 'express'
import StatusCodes from 'http-status-codes'

import { IArtistController } from 'api/artist/controller'
import { CreateArtistDto, CreateArtistResultDto } from 'api/artist/dto'
import { ArtistService, IArtistService } from 'api/artist/service'
import { ResponseBody } from 'shared/interface/response'

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
    req: Request<any, any, CreateArtistDto>,
    res: Response<ResponseBody<CreateArtistResultDto>>,
  ): Promise<void> => {
    try {
      const artist = await this.artistService.createOne(req.body)

      res.send({ data: { id: artist.id } })
    } catch (error) {
      res.status(error.statusCode).send(error)
    }
  }
}

export default new ArtistController()
