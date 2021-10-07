import {
  ITrackHistoryRepository,
  TrackHistoryRepository,
} from 'api/trackHistory/repository'
import { ITrackHistoryService } from 'api/trackHistory/service'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import {
  createNotFoundError,
  createServerError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

class TrackHistoryService implements ITrackHistoryService {
  private readonly trackHistoryRepository: ITrackHistoryRepository

  public constructor() {
    this.trackHistoryRepository = TrackHistoryRepository
  }

  public getAll: ITrackHistoryService['getAll'] = async (filter) => {
    try {
      return this.trackHistoryRepository.findAllWhere(filter)
    } catch (error) {
      throw error
    }
  }

  public createOne: ITrackHistoryService['createOne'] = async (payload) => {
    try {
      const trackHistory = await this.trackHistoryRepository.createOne(payload)

      return trackHistory
    } catch (error: any) {
      // TODO: response создавать в контроллере, здесь просто выбрасывать нужную ошибку
      if (error.name === ErrorKindsEnum.ValidationError) {
        throw new BadRequestResponse(error.name, error.message, {
          errors: error.errors,
        })
      }

      throw new ServerErrorResponse(
        ErrorKindsEnum.UnknownServerError,
        'Error was occurred while creating Track history',
      )
    }
  }

  public deleteOneById: ITrackHistoryService['deleteOneById'] = async (id) => {
    try {
      const trackHistory = await this.trackHistoryRepository.deleteOneById(id)

      return trackHistory
    } catch (error) {
      if (isNotFoundError(error)) {
        throw createNotFoundError(`Track history with id "${id}" was not found`)
      }

      throw createServerError(
        `Error while deleting track history by id "${id}"`,
      )
    }
  }

  public deleteMany: ITrackHistoryService['deleteMany'] = async (filter) => {
    try {
      await this.trackHistoryRepository.deleteMany(filter)
    } catch (error) {
      throw error
      // TODO: handle error
    }
  }
}

export default new TrackHistoryService()
