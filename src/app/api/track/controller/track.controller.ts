import StatusCodes from 'http-status-codes'
import pick from 'lodash/pick'

import { ITrackController } from 'api/track/controller'
import { ITrackService, TrackService } from 'api/track/service'

class TrackController implements ITrackController {
  private readonly trackService: ITrackService

  public constructor() {
    this.trackService = TrackService
  }

  public getAll: ITrackController['getAll'] = async (req, res) => {
    const filter = req.query

    try {
      const tracks = await this.trackService.getAll(filter)

      res.status(StatusCodes.OK).send(tracks)
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }

  public createOne: ITrackController['createOne'] = async (req, res) => {
    const user = req.user!

    try {
      const track = await this.trackService.createOne({
        name: req.body.name,
        duration: req.body.duration,
        youtube: req.body.youtube,
        album: req.body.album,
        userId: user.userId,
      })

      const response = pick(track, 'id')

      res.status(StatusCodes.OK).send(response)
    } catch (error: any) {
      res.status(error.statusCode).send(error)
    }
  }

  public deleteOneById: ITrackController['deleteOneById'] = async (
    req,
    res,
  ) => {
    const trackId = req.params.id

    try {
      await this.trackService.deleteOneById(trackId)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Track was successfully deleted' })
    } catch (error) {
      res.status(error.status).send(error)
    }
  }
}

export default new TrackController()
