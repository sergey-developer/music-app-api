import {
  ITrackHistoryRepository,
  TrackHistoryRepository,
} from 'api/trackHistory/repository'
import { ITrackHistoryService } from 'api/trackHistory/service'
import ErrorKindsEnum from 'shared/constants/errorKinds'
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
      const trackHistory = await this.trackHistoryRepository.createOne({
        user: payload.user,
        track: payload.track,
        listenDate: payload.listenDate,
      })

      return trackHistory
    } catch (error) {
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
}

export default new TrackHistoryService()
