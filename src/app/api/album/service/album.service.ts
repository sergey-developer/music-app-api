import { AlbumRepository, IAlbumRepository } from 'api/album/repository'
import { IAlbumService } from 'api/album/service'
import ErrorKindsEnum from 'shared/constants/errorKinds'
import { BadRequestResponse, ServerErrorResponse } from 'shared/utils/response'

class AlbumService implements IAlbumService {
  private readonly albumRepository: IAlbumRepository

  constructor() {
    this.albumRepository = AlbumRepository
  }

  getAll: IAlbumService['getAll'] = async () => {
    try {
      return this.albumRepository.findAll()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  createOne: IAlbumService['createOne'] = async (payload) => {
    try {
      const album = await this.albumRepository.createOne(payload)
      return album
    } catch (error) {
      console.error(error, ': AlbumService createOne')
      if (error.name === ErrorKindsEnum.ValidationError) {
        throw new BadRequestResponse(error.name, error.message, {
          errors: error.errors,
        })
      }

      throw new ServerErrorResponse(
        ErrorKindsEnum.UnknownServerError,
        'Error was occurred while creating Album',
      )
    }
  }
}

export default new AlbumService()
