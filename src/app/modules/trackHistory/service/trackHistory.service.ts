import isEmpty from 'lodash/isEmpty'

import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import {
  ITrackHistoryRepository,
  TrackHistoryRepository,
} from 'modules/trackHistory/repository'
import { ITrackHistoryService } from 'modules/trackHistory/service'
import { EMPTY_FILTER_ERR_MSG } from 'shared/constants/errorMessages'
import { omitUndefined } from 'shared/utils/common'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
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
      logger.error(error.stack)
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

      logger.error(error.stack)
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

      logger.error(error.stack)
      throw ServerError('Error while deleting track history')
    }
  }

  public deleteMany: ITrackHistoryService['deleteMany'] = async (rawFilter) => {
    const filter: typeof rawFilter = omitUndefined(rawFilter)

    if (isEmpty(filter)) {
      throw BadRequestError(EMPTY_FILTER_ERR_MSG)
    }

    try {
      await this.trackHistoryRepository.deleteMany(filter)
    } catch (error) {
      logger.error(error.stack)
      throw ServerError('Error while deleting tracks`s histories')
    }
  }
}

export default new TrackHistoryService()
