import isEmpty from 'lodash/isEmpty'
import { delay, inject, singleton } from 'tsyringe'

import {
  EMPTY_FILTER_ERR_MSG,
  VALIDATION_ERR_MSG,
} from 'app/constants/messages/errors'
import { omitUndefined } from 'app/utils/common'
import {
  AppNotFoundError,
  AppUnknownError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import { EntityNamesEnum } from 'database/constants'
import {
  isDatabaseNotFoundError,
  isDatabaseValidationError,
} from 'database/errors'
import { ITrackDocument } from 'database/models/track'
import logger from 'lib/logger'
import { RequestService } from 'modules/request/service'
import { TrackRepository } from 'modules/track/repository'
import { ITrackService } from 'modules/track/service'
import { TrackHistoryService } from 'modules/trackHistory/service'

@singleton()
class TrackService implements ITrackService {
  public constructor(
    @inject(delay(() => TrackRepository))
    private readonly trackRepository: TrackRepository,

    @inject(delay(() => RequestService))
    private readonly requestService: RequestService,

    private readonly trackHistoryService: TrackHistoryService,
  ) {}

  public getAll: ITrackService['getAll'] = async (filter) => {
    try {
      const { status, userId, artist, albumIds } = filter

      const requests = await this.requestService.getAll({
        status,
        creator: userId,
        kind: EntityNamesEnum.Track,
      })

      const trackIds = requests.map((request) => {
        const entity = request.entity as ITrackDocument
        return entity.id
      })

      const findAllFilter = { artist, albumIds, ids: trackIds }

      return this.trackRepository.findAllWhere(findAllFilter)
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppUnknownError('Error while getting tracks')
    }
  }

  public getOneById: ITrackService['getOneById'] = async (id) => {
    try {
      const track = await this.trackRepository.findOne({ id })
      return track
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Track was not found')
      }

      logger.error(error.stack)
      throw new AppUnknownError('Error while getting track')
    }
  }

  public createOne: ITrackService['createOne'] = async (payload) => {
    let track: ITrackDocument
    const unknownErrorMsg = 'Error while creating new track'

    try {
      track = await this.trackRepository.createOne({
        name: payload.name,
        duration: payload.duration,
        youtube: payload.youtube,
        album: payload.album,
      })
    } catch (error: any) {
      if (isDatabaseValidationError(error)) {
        throw new AppValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack)
      throw new AppUnknownError(unknownErrorMsg)
    }

    try {
      await this.requestService.createOne({
        entityName: EntityNamesEnum.Track,
        entity: track.id,
        creator: payload.user,
      })

      return track
    } catch (error: any) {
      logger.error(error.stack, {
        message: `Error while creating request for track with id: "${track.id}"`,
      })

      try {
        await this.trackRepository.deleteOne({ id: track.id })
      } catch (error: any) {
        logger.warn(error.stack, {
          message: `Track by id "${track.id}" probably was not deleted`,
        })
      }

      throw new AppUnknownError(unknownErrorMsg)
    }
  }

  public updateOneById: ITrackService['updateOneById'] = async (
    id,
    payload,
  ) => {
    try {
      const updatedTrack = await this.trackRepository.updateOne({ id }, payload)
      return updatedTrack
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Track was not found')
      }

      if (isDatabaseValidationError(error)) {
        throw new AppValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack, {
        message: 'Update track error',
        args: { id, payload },
      })

      throw new AppUnknownError('Error while updating track')
    }
  }

  public deleteOneById: ITrackService['deleteOneById'] = async (id) => {
    let track: ITrackDocument
    const unknownErrorMsg = 'Error while deleting track'

    try {
      track = await this.trackRepository.deleteOne({ id })
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Track was not found')
      }

      logger.error(error.stack)
      throw new AppUnknownError(unknownErrorMsg)
    }

    try {
      await this.trackHistoryService.deleteMany({ trackIds: [track.id] })
      await this.requestService.deleteOne({ entityId: track.id })

      return track
    } catch (error: any) {
      logger.error(error.stack, {
        message: `Error while deleting related objects of track with id: "${track.id}"`,
      })

      throw new AppUnknownError(unknownErrorMsg)
    }
  }

  public deleteMany: ITrackService['deleteMany'] = async (filter) => {
    const deleteManyFilter = omitUndefined(filter)

    if (isEmpty(deleteManyFilter)) {
      throw new AppValidationError(EMPTY_FILTER_ERR_MSG)
    }

    const unknownErrorMsg = 'Error while deleting tracks'

    const { tracks = [] } = deleteManyFilter
    const trackIds = tracks.map((track) => track.id)

    try {
      await this.trackRepository.deleteMany({ ids: trackIds })
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppUnknownError(unknownErrorMsg)
    }

    try {
      await this.trackHistoryService.deleteMany({ trackIds })
      await this.requestService.deleteMany({ entityIds: trackIds })
    } catch (error: any) {
      logger.error(error.stack, {
        message: 'Error while deleting related objects of tracks',
        args: { filter },
      })

      throw new AppUnknownError(unknownErrorMsg)
    }
  }
}

export default TrackService
