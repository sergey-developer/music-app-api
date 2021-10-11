import { ModelNamesEnum } from 'database/constants'
import { isNotFoundDBError } from 'database/utils/errors'
import { IRequestService, RequestService } from 'modules/request/service'
import { ITrackDocument } from 'modules/track/model'
import { ITrackRepository, TrackRepository } from 'modules/track/repository'
import { ITrackService } from 'modules/track/service'
import {
  ITrackHistoryService,
  TrackHistoryService,
} from 'modules/trackHistory/service'
import {
  isEmptyFilterError,
  isValidationError,
} from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  isBadRequestError,
  isHttpError,
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
      throw ServerError('Error while getting tracks')
    }
  }

  public createOne: ITrackService['createOne'] = async (payload) => {
    let track: ITrackDocument
    const serverError = ServerError('Error while creating new track')

    try {
      track = await this.trackRepository.createOne({
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

      throw serverError
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
        throw serverError
      } catch (error) {
        if (isHttpError(error)) {
          throw serverError
        }

        console.error(`Track by id "${track.id}" was not deleted`)
        // log not deleted track to file (Track by id "${track.id}" was not deleted)
        throw serverError
      }
    }
  }

  public deleteOneById: ITrackService['deleteOneById'] = async (id) => {
    let track: ITrackDocument

    try {
      track = await this.trackRepository.deleteOneById(id)
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError(`Track with id "${id}" was not found`)
      }

      throw ServerError(`Error while deleting track by id "${id}"`)
    }

    try {
      await this.trackHistoryService.deleteMany({ trackIds: [track.id] })
      await this.requestService.deleteOne({ entityId: track.id })

      return track
    } catch (error) {
      throw ServerError('Error while deleting related objects of track')
    }
  }

  public deleteMany: ITrackService['deleteMany'] = async ({ tracks }) => {
    const tracksToDelete = tracks || []
    const trackIds = tracksToDelete.map((track) => track.id)

    try {
      await this.trackRepository.deleteMany({ ids: trackIds })
    } catch (error) {
      if (isBadRequestError(error) && isEmptyFilterError(error.kind)) {
        throw BadRequestError(
          'Deleting many tracks with empty filter forbidden',
        )
      }

      throw ServerError('Error while deleting many tracks')
    }

    try {
      await this.trackHistoryService.deleteMany({ trackIds })
      await this.requestService.deleteMany({ entityIds: trackIds })
    } catch (error) {
      throw ServerError('Error while deleting related objects of tracks')
    }
  }
}

export default new TrackService()
