import StatusCodes from 'http-status-codes'
import _isEmpty from 'lodash/isEmpty'
import _isUndefined from 'lodash/isUndefined'
import _omitBy from 'lodash/omitBy'
import _pick from 'lodash/pick'

import { IAlbumController } from 'api/album/controller'
import { GetAllAlbumsQueryString } from 'api/album/interface'
import { AlbumService, IAlbumService } from 'api/album/service'

class AlbumController implements IAlbumController {
  private readonly albumService: IAlbumService

  constructor() {
    this.albumService = AlbumService
  }

  getAll: IAlbumController['getAll'] = async (req, res) => {
    // TODO: сделать валидацию фильтра
    const whiteListFilter = _pick(req.query, ['artist'])
    const filter: GetAllAlbumsQueryString = _omitBy(
      whiteListFilter,
      _isUndefined,
    )

    let albums

    try {
      if (_isEmpty(filter)) {
        albums = await this.albumService.getAll()
      } else {
        albums = await this.albumService.getAllWhere(filter)
      }

      res.send({ data: albums })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }

  createOne: IAlbumController['createOne'] = async (req, res) => {
    try {
      const album = await this.albumService.createOne(req.body)

      res.send({ data: { id: album.id } })
    } catch (error) {
      res.status(error.statusCode).send(error)
    }
  }

  getOneById: IAlbumController['getOneById'] = async (req, res) => {
    const albumId = req.params.id

    try {
      const album = await this.albumService.getOneById(albumId)

      if (!album) {
        throw new Error(`Album with id ${albumId} was not found`)
      }

      res.status(StatusCodes.OK).send({ data: album })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }
}

export default new AlbumController()
