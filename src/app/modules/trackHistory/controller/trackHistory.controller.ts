import { StatusCodes } from 'http-status-codes'

import { ITrackHistoryController } from 'modules/trackHistory/controller'
import {
  ITrackHistoryService,
  TrackHistoryService,
} from 'modules/trackHistory/service'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

class TrackHistoryController implements ITrackHistoryController {
  private readonly trackHistoryService: ITrackHistoryService

  public constructor() {
    this.trackHistoryService = TrackHistoryService
  }

  public getAll: ITrackHistoryController['getAll'] = async (req, res) => {
    try {
      const user = req.user!

      const tracksHistories = await this.trackHistoryService.getAll({
        userId: user.userId,
      })

      res.status(StatusCodes.OK).send({ data: tracksHistories })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public create: ITrackHistoryController['create'] = async (req, res) => {
    try {
      const user = req.user!
      const { track } = req.body

      await this.trackHistoryService.create({
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
        .send({ message: 'Track history successfully deleted' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new TrackHistoryController()
