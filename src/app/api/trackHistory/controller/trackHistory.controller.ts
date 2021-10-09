import { StatusCodes } from 'http-status-codes'

import { ITrackHistoryController } from 'api/trackHistory/controller'
import {
  ITrackHistoryService,
  TrackHistoryService,
} from 'api/trackHistory/service'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

class TrackHistoryController implements ITrackHistoryController {
  private readonly trackHistoryService: ITrackHistoryService

  public constructor() {
    this.trackHistoryService = TrackHistoryService
  }

  public getAll: ITrackHistoryController['getAll'] = async (req, res) => {
    try {
      const user = req.user!

      const trackHistory = await this.trackHistoryService.getAll({
        userId: user.userId,
      })

      res.status(StatusCodes.OK).send(trackHistory)
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public createOne: ITrackHistoryController['createOne'] = async (req, res) => {
    try {
      const user = req.user!
      const { track } = req.body

      await this.trackHistoryService.createOne({
        track,
        userId: user.userId,
      })

      res.sendStatus(StatusCodes.CREATED)
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public deleteOneById: ITrackHistoryController['deleteOneById'] = async (
    req,
    res,
  ) => {
    const trackHistoryId = req.params.id

    try {
      await this.trackHistoryService.deleteOneById(trackHistoryId)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Track history was successfully deleted' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new TrackHistoryController()
