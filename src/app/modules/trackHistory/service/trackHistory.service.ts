import isEmpty from 'lodash/isEmpty'
import { delay, inject, singleton } from 'tsyringe'

import { isNotFoundDBError } from 'database/utils/errors'
import logger from 'lib/logger'
import { TrackHistoryRepository } from 'modules/trackHistory/repository'
import { ITrackHistoryService } from 'modules/trackHistory/service'
import { EMPTY_FILTER_ERR_MSG } from 'shared/constants/errorMessages'
import { omitUndefined } from 'shared/utils/common'
import { isValidationError } from 'shared/utils/errors/checkErrorKind'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
} from 'shared/utils/errors/httpErrors'
import { ValidationError } from 'shared/utils/errors/validationErrors'

@singleton()
class TrackHistoryService implements ITrackHistoryService {
  public constructor(
    @inject(delay(() => TrackHistoryRepository))
    private readonly trackHistoryRepository: TrackHistoryRepository,
  ) {}

  public getAll: ITrackHistoryService['getAll'] = async (filter) => {
    try {
      return this.trackHistoryRepository.findAllWhere(filter)
    } catch (error: any) {
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
    } catch (error: any) {
      if (isValidationError(error.name)) {
        throw ValidationError(null, error)
      }

      logger.error(error.stack)
      throw ServerError('Error while creating new track history')
    }
  }

  public deleteOneById: ITrackHistoryService['deleteOneById'] = async (id) => {
    try {
      const trackHistory = await this.trackHistoryRepository.deleteOneById(id)
      return trackHistory
    } catch (error: any) {
      if (isNotFoundDBError(error)) {
        throw NotFoundError('Track history was not found')
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
    } catch (error: any) {
      logger.error(error.stack)
      throw ServerError('Error while deleting tracks`s histories')
    }
  }
}

export default TrackHistoryService
