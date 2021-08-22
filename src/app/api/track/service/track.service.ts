import { ITrackRepository, TrackRepository } from 'api/track/repository'
import { ITrackService } from 'api/track/service/interface'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

class TrackService implements ITrackService {
  private readonly trackRepository: ITrackRepository

  constructor() {
    this.trackRepository = TrackRepository
  }

  getAll: ITrackService['getAll'] = async () => {
    try {
      return this.trackRepository.findAll()
    } catch (error) {
      throw error
    }
  }

  getAllWhere: ITrackService['getAllWhere'] = async (filter) => {
    try {
      return this.trackRepository.findAllWhere(filter)
    } catch (error) {
      throw error
    }
  }

  createOne: ITrackService['createOne'] = async (payload) => {
    try {
      const album = await this.trackRepository.createOne(payload)
      return album
    } catch (error) {
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
}

export default new TrackService()
