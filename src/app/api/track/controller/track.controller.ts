import StatusCodes from 'http-status-codes'
import _isEmpty from 'lodash/isEmpty'
import _isNil from 'lodash/isNil'
import _omitBy from 'lodash/omitBy'
import _pick from 'lodash/pick'

import { ITrackController } from 'api/track/controller/interface'
import { GetAllTracksFilterDto } from 'api/track/interface'
import { ITrackService, TrackService } from 'api/track/service'

class TrackController implements ITrackController {
  private readonly trackService: ITrackService

  constructor() {
    this.trackService = TrackService
  }

  getAll: ITrackController['getAll'] = async (req, res) => {
    // TODO: сделать валидацию фильтра
    const whiteListFilter = _pick(req.query, ['artist', 'album'])
    const filter: GetAllTracksFilterDto = _omitBy(whiteListFilter, _isNil)
    let tracks

    try {
      if (_isEmpty(filter)) {
        tracks = await this.trackService.getAll()
      } else {
        tracks = await this.trackService.getAllWhere(filter)
      }

      res.send({ data: tracks })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
  }

  createOne: ITrackController['createOne'] = async (req, res) => {
    try {
      const track = await this.trackService.createOne(req.body)

      res.send({ data: { id: track.id } })
    } catch (error) {
      res.status(error.statusCode).send(error)
    }
  }
}

export default new TrackController()
