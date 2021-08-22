import StatusCodes from 'http-status-codes'

import { IArtistController } from 'api/artist/controller'
import { ArtistService, IArtistService } from 'api/artist/service'

class ArtistController implements IArtistController {
  private readonly artistService: IArtistService

  constructor() {
    this.artistService = ArtistService
  }

  getAll: IArtistController['getAll'] = async (req, res) => {
    try {
      const artists = await this.artistService.getAll()

      res.send({ data: artists })
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: error.message })
    }
  }

  createOne: IArtistController['createOne'] = async (req, res) => {
    try {
      const artist = await this.artistService.createOne(req.body)

      res.send({ data: { id: artist.id } })
    } catch (error) {
      res.status(error.statusCode).send(error)
    }
  }
}

export default new ArtistController()
