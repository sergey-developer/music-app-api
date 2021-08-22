import { ArtistRepository, IArtistRepository } from 'api/artist/repository'
import { IArtistService } from 'api/artist/service'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

class ArtistService implements IArtistService {
  private readonly artistRepository: IArtistRepository

  constructor() {
    this.artistRepository = ArtistRepository
  }

  getAll: IArtistService['getAll'] = async () => {
    try {
      return this.artistRepository.findAll()
    } catch (error) {
      throw error
    }
  }

  createOne: IArtistService['createOne'] = async (payload) => {
    try {
      const artist = await this.artistRepository.createOne(payload)
      return artist
    } catch (error) {
      // TODO: response создавать в контроллере, здесь просто выбрасывать нужную ошибку
      if (error.name === ErrorKindsEnum.ValidationError) {
        throw new BadRequestResponse(error.name, error.message, {
          errors: error.errors,
        })
      }

      throw new ServerErrorResponse(
        ErrorKindsEnum.UnknownServerError,
        'Error was occurred while creating Artist',
      )
    }
  }
}

export default new ArtistService()
