import { StatusCodes } from 'http-status-codes'
import { singleton } from 'tsyringe'

import { ITrackHistoryController } from 'modules/trackHistory/controller'
import { TrackHistoryService } from 'modules/trackHistory/service'
import { getHttpErrorByAppError } from 'shared/utils/errors/httpErrors'

@singleton()
class TrackHistoryController implements ITrackHistoryController {
  public constructor(
    private readonly trackHistoryService: TrackHistoryService,
  ) {}

  public getAll: ITrackHistoryController['getAll'] = async (req, res) => {
    try {
      const user = req.user!

      const tracksHistories = await this.trackHistoryService.getAll({
        user: user.userId,
      })

      res.status(StatusCodes.OK).send({ data: tracksHistories })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public createOne: ITrackHistoryController['createOne'] = async (req, res) => {
    try {
      const user = req.user!
      const { track } = req.body

      await this.trackHistoryService.createOne({
        track,
        user: user.userId,
      })

      res.sendStatus(StatusCodes.CREATED)
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public deleteOne: ITrackHistoryController['deleteOne'] = async (req, res) => {
    const { id } = req.params

    try {
      await this.trackHistoryService.deleteOneById(id)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Track history successfully deleted' })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }
}

export default TrackHistoryController
