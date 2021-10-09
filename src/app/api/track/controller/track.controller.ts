import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'

import { ITrackController } from 'api/track/controller'
import { ITrackService, TrackService } from 'api/track/service'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

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
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public createOne: ITrackController['createOne'] = async (req, res) => {
    try {
      const user = req.user!
      const { name, duration, youtube, album } = req.body

      const track = await this.trackService.createOne({
        name,
        duration,
        youtube,
        album,
        userId: user.userId,
      })

      const result = pick(track, 'id')

      res.status(StatusCodes.CREATED).send(result)
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
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
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new TrackController()
