import { StatusCodes } from 'http-status-codes'
import { singleton } from 'tsyringe'

import { ITrackHistoryController } from 'modules/trackHistory/controller'
import { TrackHistoryService } from 'modules/trackHistory/service'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

@singleton()
class TrackHistoryController implements ITrackHistoryController {
  public constructor(
    private readonly trackHistoryService: TrackHistoryService,
  ) {}

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

  public deleteOne: ITrackHistoryController['deleteOne'] = async (req, res) => {
    const { id } = req.params

    try {
      await this.trackHistoryService.deleteOneById(id)

      res
        .status(StatusCodes.OK)
        .send({ message: 'Track history successfully deleted' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default TrackHistoryController
