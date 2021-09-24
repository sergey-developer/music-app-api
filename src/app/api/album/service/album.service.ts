import createError from 'http-errors'
import StatusCodes from 'http-status-codes'
import _isEmpty from 'lodash/isEmpty'

import { IAlbumDocument } from 'api/album/model'
import { AlbumRepository, IAlbumRepository } from 'api/album/repository'
import { IAlbumService } from 'api/album/service'
import { RequestEntityNameEnum } from 'api/request/interface'
import { IRequestRepository, RequestRepository } from 'api/request/repository'
import ErrorKindsEnum from 'shared/constants/errorKinds'

class AlbumService implements IAlbumService {
  private readonly albumRepository: IAlbumRepository
  private readonly requestRepository: IRequestRepository

  public constructor() {
    this.albumRepository = AlbumRepository
    this.requestRepository = RequestRepository
  }

  public getAll: IAlbumService['getAll'] = async (filter) => {
    try {
      return _isEmpty(filter)
        ? this.albumRepository.findAll()
        : this.albumRepository.findAllWhere(filter)
    } catch (error) {
      throw new createError.InternalServerError('Error white getting albums')
    }
  }

  public createOne: IAlbumService['createOne'] = async (payload) => {
    let album: IAlbumDocument

    const serverError = new createError.InternalServerError(
      'Error while creating Album',
    )

    try {
      album = await this.albumRepository.createOne({
        name: payload.name,
        image: payload.image,
        releaseDate: payload.releaseDate,
        artist: payload.artist,
      })
    } catch (error) {
      if (error.name === ErrorKindsEnum.ValidationError) {
        throw createError(StatusCodes.BAD_REQUEST, error.message, {
          kind: ErrorKindsEnum.ValidationError,
          errors: error.errors,
        })
      }

      throw serverError
    }

    try {
      await this.requestRepository.createOne({
        creator: payload.userId,
        entity: album.id,
        entityName: RequestEntityNameEnum.Album,
      })

      return album
    } catch (error) {
      // log to file (Create request error)

      try {
        // log to file (начало удаления)
        await this.albumRepository.deleteOneById(album.id)
        // log to file (конец удаления)
        throw serverError
      } catch (error) {
        if (createError.isHttpError(error)) {
          throw serverError
        }

        console.error(`Album by id "${album.id}" was not deleted`)
        // log not deleted album to file (Album by id "${album.id}" was not deleted)
        throw serverError
      }
    }
  }

  public getOneById: IAlbumService['getOneById'] = async (id) => {
    try {
      const album = await this.albumRepository.findOneById(id)
      return album
    } catch (error) {
      if (error instanceof createError.NotFound) {
        throw new createError.NotFound(`Album with id "${id}" was not found`)
      }

      throw new createError.InternalServerError(
        `Error while getting album by id "${id}"`,
      )
    }
  }

  public deleteOneById: IAlbumService['deleteOneById'] = async (id) => {
    try {
      const album = await this.albumRepository.deleteOneById(id)
      return album
    } catch (error) {
      if (error instanceof createError.NotFound) {
        throw new createError.NotFound(`Album with id "${id}" was not found`)
      }

      throw new createError.InternalServerError(
        `Error while deleting album by id "${id}"`,
      )
    }
  }
}

export default new AlbumService()
