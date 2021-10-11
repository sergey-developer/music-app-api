import { isNotFoundDBError } from 'database/utils/errors'
import {
  ITrackHistoryRepository,
  TrackHistoryRepository,
} from 'modules/trackHistory/repository'
import { ITrackHistoryService } from 'modules/trackHistory/service'
import {
  isEmptyFilterError,
  isValidationError,
} from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  isBadRequestError,
} from 'shared/utils/errors/httpErrors'

class TrackHistoryService implements ITrackHistoryService {
  private readonly trackHistoryRepository: ITrackHistoryRepository

  public constructor() {
    this.trackHistoryRepository = TrackHistoryRepository
  }

  public getAll: ITrackHistoryService['getAll'] = async (filter) => {
    try {
      return this.trackHistoryRepository.findAllWhere(filter)
    } catch (error) {
      throw ServerError('Error while getting tracks`s histories')
    }
  }

  public createOne: ITrackHistoryService['createOne'] = async (payload) => {
    try {
      const trackHistory = await this.trackHistoryRepository.createOne({
        ...payload,
        listenDate: new Date().toISOString(),
      })

      return trackHistory
    } catch (error) {
      // TODO: протестировать ошибку валидации
      if (isValidationError(error.name)) {
        throw BadRequestError(error.message, {
          kind: error.name,
          errors: error.errors,
        })
      }

      throw ServerError('Error while creating new track history')
    }
  }

  public deleteOneById: ITrackHistoryService['deleteOneById'] = async (id) => {
    try {
      const trackHistory = await this.trackHistoryRepository.deleteOneById(id)
      return trackHistory
    } catch (error) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError(`Track history with id "${id}" was not found`)
      }

      throw ServerError(`Error while deleting track history by id "${id}"`)
    }
  }

  public deleteMany: ITrackHistoryService['deleteMany'] = async (filter) => {
    try {
      await this.trackHistoryRepository.deleteMany(filter)
    } catch (error) {
      if (isBadRequestError(error) && isEmptyFilterError(error.kind)) {
        throw BadRequestError(
          'Deleting many tracks`s histories with empty filter forbidden',
        )
      }

      throw ServerError('Error while deleting many tracks`s histories')
    }
  }
}

export default new TrackHistoryService()
