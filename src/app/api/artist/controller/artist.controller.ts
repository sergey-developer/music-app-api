import StatusCodes from 'http-status-codes'
import _pick from 'lodash/pick'

import { IArtistController } from 'api/artist/controller'
import { ArtistService, IArtistService } from 'api/artist/service'
import { RequestStatusEnum } from 'api/request/interface'

class ArtistController implements IArtistController {
  private readonly artistService: IArtistService

  constructor() {
    this.artistService = ArtistService
  }

  public getAll: IArtistController['getAll'] = async (req, res) => {
    const user = req.user
    const filter = req.query

    try {
      let artists

      if (user) {
        artists = await this.artistService.getAll(filter)
      } else {
        artists = await this.artistService.getAll({
          status: RequestStatusEnum.Approved,
        })
      }

      res.status(StatusCodes.OK).send(artists)
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: error.message })
    }
  }

  public createOne: IArtistController['createOne'] = async (req, res) => {
    const user = req.user!

    try {
      const artist = await this.artistService.createOne({
        name: req.body.name,
        info: req.body.info,
        photo: req.body.photo,
        userId: user.userId,
      })

      const response = _pick(artist, 'id')

      res.status(StatusCodes.OK).send(response)
    } catch (error: any) {
      res.status(error.statusCode).send(error)
    }
  }
}

export default new ArtistController()
