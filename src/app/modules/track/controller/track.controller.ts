import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'
import { singleton } from 'tsyringe'

import { getHttpErrorByAppError } from 'app/utils/errors/httpErrors'
import { ITrackDocumentArray } from 'database/models/track'
import { RequestStatusEnum } from 'modules/request/constants'
import { ITrackController } from 'modules/track/controller'
import { TrackService } from 'modules/track/service'

@singleton()
class TrackController implements ITrackController {
  public constructor(private readonly trackService: TrackService) {}

  public getAll: ITrackController['getAll'] = async (req, res) => {
    const userIsAuthorized = !!req.user
    const { album, ...filter } = req.query

    try {
      let tracks: ITrackDocumentArray

      if (userIsAuthorized) {
        tracks = await this.trackService.getAll({
          ...filter,
          albumId: album,
        })
      } else {
        tracks = await this.trackService.getAll({
          status: RequestStatusEnum.Approved,
        })
      }

      res.status(StatusCodes.OK).send({ data: tracks })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public getOne: ITrackController['getOne'] = async (req, res) => {
    const { id } = req.params

    try {
      const track = await this.trackService.getOneById(id)
      res.status(StatusCodes.OK).send({ data: track })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
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
        user: user.userId,
      })

      const result = pick(track, 'id')

      res
        .status(StatusCodes.CREATED)
        .send({ data: result, message: 'Track successfully created' })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public updateOne: ITrackController['updateOne'] = async (req, res) => {
    try {
      const { id } = req.params
      const payload = pick(req.body, 'name', 'duration', 'youtube', 'album')

      await this.trackService.updateOneById(id, payload)

      res.status(StatusCodes.OK).send({ message: 'Track successfully updated' })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }

  public deleteOne: ITrackController['deleteOne'] = async (req, res) => {
    const { id } = req.params

    try {
      await this.trackService.deleteOneById(id)

      res.status(StatusCodes.OK).send({ message: 'Track successfully deleted' })
    } catch (error) {
      const httpError = getHttpErrorByAppError(error)
      res.status(httpError.status).send(httpError)
    }
  }
}

export default TrackController
