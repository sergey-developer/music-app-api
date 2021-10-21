import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'

import { IArtistController } from 'modules/artist/controller'
import { RequestStatusEnum } from 'modules/request/constants'
import { ITrackController } from 'modules/track/controller'
import { ITrackDocumentArray } from 'modules/track/interface'
import { ITrackService, TrackService } from 'modules/track/service'
import { ensureHttpError } from 'shared/utils/errors/httpErrors'

class TrackController implements ITrackController {
  private readonly trackService: ITrackService

  public constructor() {
    this.trackService = TrackService
  }

  public getAll: ITrackController['getAll'] = async (req, res) => {
    const userIsAuthorized = !!req.user
    const { album, ...filter } = req.query

    try {
      let tracks: ITrackDocumentArray

      if (userIsAuthorized) {
        tracks = await this.trackService.getAll({
          ...filter,
          albumIds: album ? [album] : undefined,
        })
      } else {
        tracks = await this.trackService.getAll({
          status: RequestStatusEnum.Approved,
        })
      }

      res.status(StatusCodes.OK).send({ data: tracks })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public getOne: ITrackController['getOne'] = async (req, res) => {
    const { id } = req.params

    try {
      const track = await this.trackService.getOneById(id)
      res.status(StatusCodes.OK).send({ data: track })
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

      res
        .status(StatusCodes.CREATED)
        .send({ data: result, message: 'Track successfully created' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public updateOne: ITrackController['updateOne'] = async (req, res) => {
    try {
      const { id } = req.params
      const payload = pick(req.body, 'name', 'duration', 'youtube', 'album')

      await this.trackService.updateById(id, payload)

      res.status(StatusCodes.OK).send({ message: 'Track successfully updated' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }

  public deleteOne: ITrackController['deleteOne'] = async (req, res) => {
    const { id } = req.params

    try {
      await this.trackService.deleteOneById(id)

      res.status(StatusCodes.OK).send({ message: 'Track successfully deleted' })
    } catch (exception) {
      const error = ensureHttpError(exception)
      res.status(error.status).send(error)
    }
  }
}

export default new TrackController()
