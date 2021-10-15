import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'

import { IAlbumController } from 'modules/album/controller'
import { IArtistController } from 'modules/artist/controller'
import { IArtistDocumentArray } from 'modules/artist/interface'
import { ArtistService, IArtistService } from 'modules/artist/service'
import { RequestStatusEnum } from 'modules/request/constants'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

class ArtistController implements IArtistController {
  private readonly artistService: IArtistService

  constructor() {
    this.artistService = ArtistService
  }

  public getAll: IArtistController['getAll'] = async (req, res) => {
    const userIsAuthorized = !!req.user
    const filter = req.query

    try {
      let artists: IArtistDocumentArray

      if (userIsAuthorized) {
        artists = await this.artistService.getAll(filter)
      } else {
        artists = await this.artistService.getAll({
          status: RequestStatusEnum.Approved,
        })
      }

      res.status(StatusCodes.OK).send({ data: artists })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public getOne: IArtistController['getOne'] = async (req, res) => {
    const { id } = req.params

    try {
      const artist = await this.artistService.getOneById(id)
      res.status(StatusCodes.OK).send({ data: artist })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public create: IArtistController['create'] = async (req, res) => {
    try {
      const user = req.user!
      const { name, info, photo } = req.body

      const artist = await this.artistService.create({
        name,
        info,
        photo,
        userId: user.userId,
      })

      const result = pick(artist, 'id')

      res
        .status(StatusCodes.CREATED)
        .send({ data: result, message: 'Artist successfully created' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public update: IArtistController['update'] = async (req, res) => {
    try {
      const { id } = req.params
      const payload = pick(req.body, 'name', 'photo', 'info')

      await this.artistService.updateById(id, payload)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Artist successfully updated' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public deleteOne: IArtistController['deleteOne'] = async (req, res) => {
    const { id } = req.params

    try {
      await this.artistService.deleteOneById(id)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Artist successfully deleted' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new ArtistController()
