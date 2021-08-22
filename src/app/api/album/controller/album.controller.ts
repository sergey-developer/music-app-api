import StatusCodes from 'http-status-codes'

import { IAlbumController } from 'api/album/controller'
import { AlbumService, IAlbumService } from 'api/album/service'

class AlbumController implements IAlbumController {
  private readonly albumService: IAlbumService

  constructor() {
    this.albumService = AlbumService
  }

  findAll: IAlbumController['findAll'] = async (req, res) => {
    try {
      const allAlbums = await this.albumService.getAll()

      res.send({ data: allAlbums })
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: error.message })
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
}

export default new AlbumController()
