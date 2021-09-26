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
    } catch (error: any) {
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
    } catch (error: any) {
      res.status(error.status).send(error)
    }
  }

  public getOneById: IAlbumController['getOneById'] = async (req, res) => {
    const albumId = req.params.id

    try {
      const album = await this.albumService.getOneById(albumId)
      res.status(StatusCodes.OK).send(album)
    } catch (error: any) {
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
    } catch (error: any) {
      res.status(error.status).send(error)
    }
  }
}

export default new AlbumController()
