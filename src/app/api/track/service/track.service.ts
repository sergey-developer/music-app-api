import isEmpty from 'lodash/isEmpty'

import { IRequestService, RequestService } from 'api/request/service'
import { ITrackDocument } from 'api/track/model'
import { ITrackRepository, TrackRepository } from 'api/track/repository'
import { ITrackService } from 'api/track/service'
import {
  ITrackHistoryService,
  TrackHistoryService,
} from 'api/trackHistory/service'
import { ModelNamesEnum } from 'database/constants'
import {
  isEmptyFilterError,
  isValidationError,
} from 'shared/utils/errors/checkErrorKind'
import {
  badRequestError,
  isBadRequestError,
  isHttpError,
  isNotFoundError,
  notFoundError,
  serverError,
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
      return isEmpty(filter)
        ? this.trackRepository.findAll()
        : this.trackRepository.findAllWhere(filter)
    } catch (error) {
      throw serverError('Error while getting tracks')
    }
  }

  public createOne: ITrackService['createOne'] = async (payload) => {
    let track: ITrackDocument
    const theServerError = serverError('Error while creating new track')

    try {
      track = await this.trackRepository.createOne({
        name: payload.name,
        duration: payload.duration,
        youtube: payload.youtube,
        album: payload.album,
      })
    } catch (error) {
      if (isValidationError(error.name)) {
        throw badRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      throw theServerError
    }

    try {
      await this.requestService.createOne({
        entityName: ModelNamesEnum.Track,
        entity: track.id,
        creator: payload.userId,
      })

      return track
    } catch (error) {
      // log to file (Create request error)
      try {
        // log to file (начало удаления)
        await this.trackRepository.deleteOneById(track.id)
        // log to file (конец удаления)
        throw theServerError
      } catch (error) {
        if (isHttpError(error)) {
          throw theServerError
        }

        console.error(`Track by id "${track.id}" was not deleted`)
        // log not deleted track to file (Track by id "${track.id}" was not deleted)
        throw theServerError
      }
    }
  }

  public deleteOneById: ITrackService['deleteOneById'] = async (id) => {
    let track: ITrackDocument

    try {
      track = await this.trackRepository.deleteOneById(id)
    } catch (error) {
      if (isNotFoundError(error)) {
        throw notFoundError(`Track with id "${id}" was not found`)
      }

      throw serverError(`Error while deleting track by id "${id}"`)
    }

    try {
      await this.trackHistoryService.deleteMany({ trackIds: [track.id] })
      await this.requestService.deleteOne({ entityId: track.id })

      return track
    } catch (error) {
      throw serverError('Error while deleting related objects of track')
    }
  }

  public deleteMany: ITrackService['deleteMany'] = async ({ tracks }) => {
    const tracksToDelete = tracks || []
    const trackIds = tracksToDelete.map((track) => track.id)

    try {
      await this.trackRepository.deleteMany({ ids: trackIds })
    } catch (error) {
      if (isBadRequestError(error)) {
        if (isEmptyFilterError(error.kind)) {
          throw badRequestError(
            'Deleting many tracks with empty filter forbidden',
          )
        }
      }

      throw serverError('Error while deleting many tracks')
    }

    try {
      await this.trackHistoryService.deleteMany({ trackIds })
      await this.requestService.deleteMany({ entityIds: trackIds })
    } catch (error) {
      throw serverError('Error while deleting related objects of tracks')
    }
  }
}

export default new TrackService()
