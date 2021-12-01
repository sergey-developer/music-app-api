import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'
import { singleton } from 'tsyringe'

import { getHttpErrorByAppError } from 'app/utils/errors/httpErrors'
import { IAlbumController } from 'modules/album/controller'
import { AlbumService, IGetAllAlbumsFilter } from 'modules/album/service'
import { RequestStatusEnum } from 'modules/request/constants'

@singleton()
class AlbumController implements IAlbumController {
  public constructor(private readonly albumService: AlbumService) {}

  public getAll: IAlbumController['getAll'] = async (req, res) => {
    const { query, user } = req
    const userIsAuthorized = !!user

    const filter: IGetAllAlbumsFilter = userIsAuthorized
      ? { status: query.status, artist: query.artist, userId: query.userId }
      : { status: RequestStatusEnum.Approved }

    try {
      const albums = await this.albumService.getAll(filter)
      res.status(StatusCodes.OK).send({ data: albums })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public getOne: IAlbumController['getOne'] = async (req, res) => {
    const { id } = req.params

    try {
      const album = await this.albumService.getOneById(id)
      res.status(StatusCodes.OK).send({ data: album })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
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
        user: user?.userId!,
      })

      const result = pick(album, 'id')

      res
        .status(StatusCodes.CREATED)
        .send({ data: result, message: 'Album successfully created' })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
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
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public deleteOne: IAlbumController['deleteOne'] = async (req, res) => {
    const { id } = req.params

    try {
      await this.albumService.deleteOneById(id)
      res.status(StatusCodes.OK).send({ message: 'Album successfully deleted' })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }
}

export default AlbumController
