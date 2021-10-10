import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'

import { IAlbumController } from 'api/album/controller'
import { IAlbumDocumentArray } from 'api/album/interface'
import { AlbumService, IAlbumService } from 'api/album/service'
import { RequestStatusEnum } from 'api/request/constants'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

class AlbumController implements IAlbumController {
  private readonly albumService: IAlbumService

  public constructor() {
    this.albumService = AlbumService
  }

  public getAll: IAlbumController['getAll'] = async (req, res) => {
    const userIsAuthorized = !!req.user
    const filter = req.query

    try {
      let albums: IAlbumDocumentArray

      if (userIsAuthorized) {
        albums = await this.albumService.getAll(filter)
      } else {
        albums = await this.albumService.getAll({
          status: RequestStatusEnum.Approved,
        })
      }

      res.status(StatusCodes.OK).send(albums)
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public createOne: IAlbumController['createOne'] = async (req, res) => {
    try {
      const user = req.user!
      const { name, image, releaseDate, artist } = req.body

      const album = await this.albumService.createOne({
        name,
        image,
        releaseDate,
        artist,
        userId: user.userId,
      })

      const result = pick(album, 'id')

      res.status(StatusCodes.CREATED).send(result)
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public getOneById: IAlbumController['getOneById'] = async (req, res) => {
    const albumId = req.params.id

    try {
      const album = await this.albumService.getOneById(albumId)
      res.status(StatusCodes.OK).send(album)
    } catch (exception) {
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
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new AlbumController()
