import createError from 'http-errors'
import StatusCodes from 'http-status-codes'
import _pick from 'lodash/pick'

import { IAlbumController } from 'api/album/controller'
import { AlbumService, IAlbumService } from 'api/album/service'

class AlbumController implements IAlbumController {
  private readonly albumService: IAlbumService

  public constructor() {
    this.albumService = AlbumService
  }

  public getAll: IAlbumController['getAll'] = async (req, res) => {
    const filter = req.query

    try {
      const albums = await this.albumService.getAll(filter)

      res.status(StatusCodes.OK).send(albums)
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }

  public createOne: IAlbumController['createOne'] = async (req, res) => {
    const user = req.user!

    try {
      const album = await this.albumService.createOne({
        name: req.body.name,
        image: req.body.image,
        releaseDate: req.body.releaseDate,
        artist: req.body.artist,
        userId: user.userId,
      })

      const response = _pick(album, 'id')

      res.status(StatusCodes.OK).send(response)
    } catch (error) {
      res.status(error.statusCode).send(error)
    }
  }

  public getOneById: IAlbumController['getOneById'] = async (req, res) => {
    const albumId = req.params.id

    try {
      const album = await this.albumService.getOneById(albumId)

      if (!album) {
        throw new createError.NotFound(
          `Album with id "${albumId}" was not found`,
        )
      }

      res.status(StatusCodes.OK).send(album)
    } catch (error) {
      if (error instanceof createError.NotFound) {
        res.status(error.status).send(error)
        return
      }

      const serverError = createError()
      res.status(serverError.status).send(serverError)
    }
  }
}

export default new AlbumController()
