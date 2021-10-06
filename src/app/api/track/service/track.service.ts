import _isEmpty from 'lodash/isEmpty'

import { IRequestService, RequestService } from 'api/request/service'
import { ITrackRepository, TrackRepository } from 'api/track/repository'
import { ITrackService } from 'api/track/service'
import {
  ITrackHistoryService,
  TrackHistoryService,
} from 'api/trackHistory/service'
import { ModelNamesEnum } from 'database/constants'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import {
  createNotFoundError,
  createServerError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

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
      return _isEmpty(filter)
        ? this.trackRepository.findAll()
        : this.trackRepository.findAllWhere(filter)
    } catch (error) {
      throw error
    }
  }

  public createOne: ITrackService['createOne'] = async (payload) => {
    try {
      const track = await this.trackRepository.createOne({
        name: payload.name,
        duration: payload.duration,
        youtube: payload.youtube,
        album: payload.album,
      })

      await this.requestService.createOne({
        entityName: ModelNamesEnum.Track,
        entity: track.id,
        creator: payload.userId,
      })

      return track
    } catch (error: any) {
      console.log({ error })
      // TODO: при ошибки создания request удалять созданный track
      // TODO: response создавать в контроллере, здесь просто выбрасывать нужную ошибку
      if (error.name === ErrorKindsEnum.ValidationError) {
        throw new BadRequestResponse(error.name, error.message, {
          errors: error.errors,
        })
      }

      throw new ServerErrorResponse(
        ErrorKindsEnum.UnknownServerError,
        'Error was occurred while creating Track',
      )
    }
  }

  public deleteOneById: ITrackService['deleteOneById'] = async (id) => {
    try {
      const track = await this.trackRepository.deleteOneById(id)

      await this.trackHistoryService.deleteMany({ trackIds: [track.id] })
      await this.requestService.deleteOne({ entityId: track.id })

      return track
    } catch (error) {
      if (isNotFoundError(error)) {
        throw createNotFoundError(`Track with id "${id}" was not found`)
      }

      throw createServerError(`Error while deleting track by id "${id}"`)
    }
  }

  public deleteMany: ITrackService['deleteMany'] = async (filter) => {
    try {
      const trackIds = _isEmpty(filter.tracks)
        ? []
        : filter.tracks!.map((track) => track.id)

      await this.trackRepository.deleteMany({ ids: trackIds })
      await this.trackHistoryService.deleteMany({ trackIds })
      await this.requestService.deleteMany({ entityIds: trackIds })
    } catch (error) {
      throw error
      // TODO: handle error
    }
  }
}

export default new TrackService()
