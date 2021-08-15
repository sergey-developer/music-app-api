import { CreateArtistDto, CreateArtistResultDto } from 'api/artist/dto'
import { ArtistRepository, IArtistRepository } from 'api/artist/repository'
import { IArtistService } from 'api/artist/service'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

class ArtistService implements IArtistService {
  private readonly artistRepository: IArtistRepository

  constructor() {
    this.artistRepository = ArtistRepository
  }

  getAll = async () => {
    try {
      return this.artistRepository.findAll()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  createOne = async (
    payload: CreateArtistDto,
  ): Promise<CreateArtistResultDto> => {
    try {
      const createdArtist = await this.artistRepository.createOne(payload)

      return createdArtist
    } catch (error) {
      console.error(error, ': ArtistService createOne')
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
