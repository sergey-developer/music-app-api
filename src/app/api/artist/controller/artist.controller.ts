import StatusCodes from 'http-status-codes'

import { IArtistController } from 'api/artist/controller'
import { ArtistService, IArtistService } from 'api/artist/service'

class ArtistController implements IArtistController {
  private readonly artistService: IArtistService

  constructor() {
    this.artistService = ArtistService
  }

  findAll: IArtistController['findAll'] = async (req, res) => {
    try {
      const allArtists = await this.artistService.getAll()

      res.send({ data: allArtists })
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
