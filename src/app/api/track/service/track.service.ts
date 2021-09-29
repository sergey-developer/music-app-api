import { RequestEntityNameEnum } from 'api/request/interface'
import { IRequestRepository, RequestRepository } from 'api/request/repository'
import { ITrackRepository, TrackRepository } from 'api/track/repository'
import { ITrackService } from 'api/track/service'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

class TrackService implements ITrackService {
  private readonly trackRepository: ITrackRepository
  private readonly requestRepository: IRequestRepository

  constructor() {
    this.trackRepository = TrackRepository
    this.requestRepository = RequestRepository
  }

  getAll: ITrackService['getAll'] = async (filter) => {
    try {
      return this.trackRepository.findAllWhere(filter)
    } catch (error) {
      throw error
    }
  }

  createOne: ITrackService['createOne'] = async (payload) => {
    try {
      const track = await this.trackRepository.createOne({
        name: payload.name,
        duration: payload.duration,
        youtube: payload.youtube,
        album: payload.album,
      })

      await this.requestRepository.createOne({
        entityName: RequestEntityNameEnum.Track,
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
}

export default new TrackService()
