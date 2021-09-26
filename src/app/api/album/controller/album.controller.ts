import StatusCodes from 'http-status-codes'
import _pick from 'lodash/pick'

import { IAlbumController } from 'api/album/controller'
import { AlbumService, IAlbumService } from 'api/album/service'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

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
    } catch (exception: any) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
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

      res.status(StatusCodes.OK).send(_pick(album, 'id'))
    } catch (exception: any) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public getOneById: IAlbumController['getOneById'] = async (req, res) => {
    const albumId = req.params.id

    try {
      const album = await this.albumService.getOneById(albumId)
      res.status(StatusCodes.OK).send(album)
    } catch (exception: any) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public deleteOneById: IAlbumController['deleteOneById'] = async (
    req,
    res,
  ) => {
    const albumId = req.params.id

    try {
      await this.albumService.deleteOneById(albumId)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Album was successfully deleted' })
    } catch (exception: any) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new AlbumController()
