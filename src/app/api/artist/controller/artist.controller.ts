import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'

import { IArtistController } from 'api/artist/controller'
import { ArtistService, IArtistService } from 'api/artist/service'
import { RequestStatusEnum } from 'api/request/constants'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

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
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public createOne: IArtistController['createOne'] = async (req, res) => {
    try {
      const user = req.user!
      const { name, info, photo } = req.body

      const artist = await this.artistService.createOne({
        name,
        info,
        photo,
        userId: user.userId,
      })

      const result = pick(artist, 'id')

      res.status(StatusCodes.CREATED).send(result)
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
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
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new ArtistController()
