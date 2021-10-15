import isEmpty from 'lodash/isEmpty'

import { ModelNamesEnum } from 'database/constants'
import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import { IRequestService, RequestService } from 'modules/request/service'
import { ITrackDocument } from 'modules/track/model'
import { ITrackRepository, TrackRepository } from 'modules/track/repository'
import { ITrackService } from 'modules/track/service'
import {
  ITrackHistoryService,
  TrackHistoryService,
} from 'modules/trackHistory/service'
import { EMPTY_FILTER_ERR_MSG } from 'shared/constants/errorMessages'
import { omitUndefined } from 'shared/utils/common'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
} from 'shared/utils/errors/httpErrors'

class TrackService implements ITrackService {
  private readonly trackRepository: ITrackRepository
  private readonly requestService: IRequestService
  private readonly trackHistoryService: ITrackHistoryService

  public constructor() {
    this.trackRepository = TrackRepository
    this.requestService = RequestService
    this.trackHistoryService = TrackHistoryService
  }

  public getAll: ITrackService['getAll'] = async (filter) => {
    try {
      const { status, userId, artist, albumIds } = filter

      const requests = await this.requestService.getAll({
        status,
        creator: userId,
        kind: ModelNamesEnum.Track,
      })

      const trackIds = requests.map((request) => {
        const entity = request.entity as ITrackDocument
        return entity.id
      })

      const repoFilter = { artist, albumIds, ids: trackIds }

      return this.trackRepository.findAllWhere(repoFilter)
    } catch (error) {
      logger.error(error.stack)
      throw ServerError('Error while getting tracks')
    }
  }

  public getOneById: ITrackService['getOneById'] = async (id) => {
    try {
      const track = await this.trackRepository.findOneById(id)
      return track
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError('Track was not found')
      }

      logger.error(error.stack)
      throw ServerError('Error while getting track')
    }
  }

  public create: ITrackService['create'] = async (payload) => {
    let track: ITrackDocument

    const serverErrorMsg = 'Error while creating new track'

    try {
      track = await this.trackRepository.create({
        name: payload.name,
        duration: payload.duration,
        youtube: payload.youtube,
        album: payload.album,
      })
    } catch (error) {
      if (isValidationError(error.name)) {
        throw BadRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }

    try {
      await this.requestService.create({
        entityName: ModelNamesEnum.Track,
        entity: track.id,
        creator: payload.userId,
      })

      return track
    } catch (error) {
      logger.error(error.stack, {
        message: `Error while creating request for track with id: "${track.id}"`,
      })

      try {
        await this.trackRepository.deleteOneById(track.id)
      } catch (error) {
        logger.warn(error.stack, {
          message: `Track by id "${track.id}" was not deleted`,
        })
      }

      throw ServerError(serverErrorMsg)
    }
  }

  public updateById: ITrackService['updateById'] = async (id, payload) => {
    try {
      await this.trackRepository.update({ id }, payload)
    } catch (error) {
      if (isValidationError(error.name)) {
        throw BadRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      if (isNotFoundDBError(error)) {
        throw NotFoundError('Track was not found')
      }

      logger.error(error.stack, {
        message: 'Update track error',
        args: { id, payload },
      })

      throw ServerError('Error while updating track')
    }
  }

  public deleteOneById: ITrackService['deleteOneById'] = async (id) => {
    let track: ITrackDocument

    const serverErrorMsg = 'Error while deleting track'

    try {
      track = await this.trackRepository.deleteOneById(id)
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError(`Track with id "${id}" was not found`)
      }

      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }

    try {
      await this.trackHistoryService.deleteMany({ trackIds: [track.id] })
      await this.requestService.deleteOne({ entityId: track.id })

      return track
    } catch (error) {
      logger.error(error.stack, {
        message: `Error while deleting related objects of track with id: "${track.id}"`,
      })

      throw ServerError(serverErrorMsg)
    }
  }

  public deleteMany: ITrackService['deleteMany'] = async (rawFilter) => {
    const filter: typeof rawFilter = omitUndefined(rawFilter)

    if (isEmpty(filter)) {
      throw BadRequestError(EMPTY_FILTER_ERR_MSG)
    }

    const { tracks = [] } = filter
    const trackIds = tracks.map((track) => track.id)

    const serverErrorMsg = 'Error while deleting tracks'

    try {
      await this.trackRepository.deleteMany({ ids: trackIds })
    } catch (error) {
      logger.error(error.stack)
      throw ServerError(serverErrorMsg)
    }

    try {
      await this.trackHistoryService.deleteMany({ trackIds })
      await this.requestService.deleteMany({ entityIds: trackIds })
    } catch (error) {
      logger.error(error.stack, {
        message: 'Error while deleting related objects of tracks',
        args: { filter },
      })

      throw ServerError(serverErrorMsg)
    }
  }
}

export default new TrackService()
