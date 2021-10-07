import StatusCodes from 'http-status-codes'
import pick from 'lodash/pick'

import { IArtistController } from 'api/artist/controller'
import { ArtistService, IArtistService } from 'api/artist/service'
import { RequestStatusEnum } from 'api/request/constants'

class ArtistController implements IArtistController {
  private readonly artistService: IArtistService

  constructor() {
    this.artistService = ArtistService
  }

  public getAll: IArtistController['getAll'] = async (req, res) => {
    // TODO: написать мидлвар optionalAuth и если есть токен то проверять сессию как в auth и
    //  записывать в req.userIsAuthorized. Проверку сессии вынести в функцию и исп-ть в обоих мидлварах
    const userIsAuthorized = req.cookies.token
    const filter = req.query

    try {
      let artists

      if (userIsAuthorized) {
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

      const response = pick(artist, 'id')

      res.status(StatusCodes.OK).send(response)
    } catch (error: any) {
      res.status(error.statusCode).send(error)
    }
  }

  public deleteOneById: IArtistController['deleteOneById'] = async (
    req,
    res,
  ) => {
    const artistId = req.params.id

    try {
      await this.artistService.deleteOneById(artistId)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Artist was successfully deleted' })
    } catch (error) {
      res.status(error.status).send(error)
    }
  }
}

export default new ArtistController()
