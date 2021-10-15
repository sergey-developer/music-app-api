import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'

import { IAlbumController } from 'modules/album/controller'
import { IAlbumDocumentArray } from 'modules/album/interface'
import { AlbumService, IAlbumService } from 'modules/album/service'
import { RequestStatusEnum } from 'modules/request/constants'
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

      res.status(StatusCodes.OK).send({ data: albums })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public getOne: IAlbumController['getOne'] = async (req, res) => {
    const albumId = req.params.id

    try {
      const album = await this.albumService.getOneById(albumId)
      res.status(StatusCodes.OK).send({ data: album })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public create: IAlbumController['create'] = async (req, res) => {
    try {
      const user = req.user!
      const { name, image, releaseDate, artist } = req.body

      const album = await this.albumService.create({
        name,
        image,
        releaseDate,
        artist,
        userId: user.userId,
      })

      const result = pick(album, 'id')

      res
        .status(StatusCodes.CREATED)
        .send({ data: result, message: 'Album successfully created' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public update: IAlbumController['update'] = async (req, res) => {
    try {
      const { id } = req.params
      const payload = pick(req.body, 'image', 'artist', 'name', 'releaseDate')

      await this.albumService.updateById(id, payload)

      res.status(StatusCodes.OK).send({ message: 'Album successfully updated' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public deleteOne: IAlbumController['deleteOne'] = async (req, res) => {
    const albumId = req.params.id

    try {
      await this.albumService.deleteOneById(albumId)

      res.status(StatusCodes.OK).send({ message: 'Album successfully deleted' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new AlbumController()
