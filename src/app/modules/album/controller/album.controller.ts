import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'
import { singleton } from 'tsyringe'

import { IAlbumController } from 'modules/album/controller'
import { IAlbumDocumentArray } from 'modules/album/interface'
import { AlbumService } from 'modules/album/service'
import { RequestStatusEnum } from 'modules/request/constants'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

@singleton()
class AlbumController implements IAlbumController {
  public constructor(private readonly albumService: AlbumService) {}

  public getAll: IAlbumController['getAll'] = async (req, res) => {
    const { query, user } = req
    const userIsAuthorized = !!user
    const filter = query

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
    const { id } = req.params

    try {
      const album = await this.albumService.getOneById(id)
      res.status(StatusCodes.OK).send({ data: album })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public createOne: IAlbumController['createOne'] = async (req, res) => {
    try {
      const { file, body, user } = req
      const { name, releaseDate, artist } = body

      const album = await this.albumService.createOne({
        name,
        image: file?.filename,
        releaseDate,
        artist,
        userId: user?.userId!,
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

  public updateOne: IAlbumController['updateOne'] = async (req, res) => {
    try {
      const { file, params, body } = req
      const { id } = params
      const { name, releaseDate, artist } = body

      await this.albumService.updateOneById(id, {
        name,
        releaseDate,
        artist,
        image: file?.filename || null,
      })

      res.status(StatusCodes.OK).send({ message: 'Album successfully updated' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public deleteOne: IAlbumController['deleteOne'] = async (req, res) => {
    const { id } = req.params

    try {
      await this.albumService.deleteOneById(id)

      res.status(StatusCodes.OK).send({ message: 'Album successfully deleted' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default AlbumController
