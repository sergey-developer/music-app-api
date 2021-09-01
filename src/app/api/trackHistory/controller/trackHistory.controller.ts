import StatusCodes from 'http-status-codes'

import { ITrackHistoryController } from 'api/trackHistory/controller'
import {
  ITrackHistoryService,
  TrackHistoryService,
} from 'api/trackHistory/service'

class TrackHistoryController implements ITrackHistoryController {
  private readonly trackHistoryService: ITrackHistoryService

  public constructor() {
    this.trackHistoryService = TrackHistoryService
  }

  public getAll: ITrackHistoryController['getAll'] = async (req, res) => {
    const user = req.user!

    try {
      const trackHistory = await this.trackHistoryService.getAll({
        user: user.userId,
      })

      res.status(StatusCodes.OK).send({ data: trackHistory })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }

  public createOne: ITrackHistoryController['createOne'] = async (req, res) => {
    const user = req.user!

    try {
      await this.trackHistoryService.createOne({
        user: user.userId,
        track: req.body.track,
        listenDate: new Date(),
      })

      res.sendStatus(StatusCodes.OK)
    } catch (error) {
      res.status(error.statusCode).send(error)
    }
  }
}

export default new TrackHistoryController()
