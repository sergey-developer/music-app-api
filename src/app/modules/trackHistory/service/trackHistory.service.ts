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
import {
  isDatabaseNotFoundError,
  isDatabaseValidationError,
} from 'database/errors'
import logger from 'lib/logger'
import { TrackHistoryRepository } from 'modules/trackHistory/repository'
import { ITrackHistoryService } from 'modules/trackHistory/service'

@singleton()
class TrackHistoryService implements ITrackHistoryService {
  public constructor(
    @inject(delay(() => TrackHistoryRepository))
    private readonly trackHistoryRepository: TrackHistoryRepository,
  ) {}

  public getAll: ITrackHistoryService['getAll'] = async (filter) => {
    try {
      const trackHistories = await this.trackHistoryRepository.findAllWhere(
        filter,
      )

      return trackHistories
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppUnknownError('Error while getting tracks`s histories')
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
      if (isDatabaseValidationError(error)) {
        throw new AppValidationError(VALIDATION_ERR_MSG, error.errors)
      }

      logger.error(error.stack)
      throw new AppUnknownError('Error while creating new track history')
    }
  }

  public deleteOneById: ITrackHistoryService['deleteOneById'] = async (id) => {
    try {
      const trackHistory = await this.trackHistoryRepository.deleteOne({ id })
      return trackHistory
    } catch (error: any) {
      if (isDatabaseNotFoundError(error)) {
        throw new AppNotFoundError('Track history was not found')
      }

      logger.error(error.stack)
      throw new AppUnknownError('Error while deleting track history')
    }
  }

  public deleteMany: ITrackHistoryService['deleteMany'] = async (filter) => {
    const deleteManyFilter = omitUndefined(filter)

    if (isEmpty(deleteManyFilter)) {
      throw new AppValidationError(EMPTY_FILTER_ERR_MSG)
    }

    try {
      const result = await this.trackHistoryRepository.deleteMany(
        deleteManyFilter,
      )

      return result
    } catch (error: any) {
      logger.error(error.stack)
      throw new AppUnknownError('Error while deleting tracks`s histories')
    }
  }
}

export default TrackHistoryService
