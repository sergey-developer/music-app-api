import isEmpty from 'lodash/isEmpty'
import { FilterQuery, Error as MongooseError, QueryOptions } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import { omitUndefined } from 'app/utils/common'
import {
  DatabaseNotFoundError,
  DatabaseUnknownError,
  DatabaseValidationError,
} from 'database/errors'
import { IAlbumDocument, IAlbumModel } from 'database/models/album'
import { getValidationErrors } from 'database/utils/errors'
import { DiTokenEnum } from 'lib/dependency-injection'
import { IAlbumRepository } from 'modules/album/repository'

@singleton()
class AlbumRepository implements IAlbumRepository {
  public constructor(
    @inject(DiTokenEnum.Album)
    private readonly album: IAlbumModel,
  ) {}

  public findAllWhere: IAlbumRepository['findAllWhere'] = async (filter) => {
    try {
      const { artist, ids } = omitUndefined(filter)

      const filterByArtist: FilterQuery<IAlbumDocument> = artist
        ? { artist }
        : {}
      const filterById: FilterQuery<IAlbumDocument> = isEmpty(ids)
        ? {}
        : { _id: { $in: ids } }

      const filterToApply: FilterQuery<IAlbumDocument> = {
        ...filterByArtist,
        ...filterById,
      }

      const albums = await this.album.find(filterToApply).exec()
      return albums
    } catch (error: any) {
      throw new DatabaseUnknownError(error.message)
    }
  }

  public findOne: IAlbumRepository['findOne'] = async (filter) => {
    try {
      const { id } = omitUndefined(filter)

      const filterById: FilterQuery<IAlbumDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<IAlbumDocument> = { ...filterById }

      const album = await this.album.findOne(filterToApply).orFail().exec()
      return album
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public createOne: IAlbumRepository['createOne'] = async (payload) => {
    try {
      const newAlbum = new this.album(payload)
      const album = await newAlbum.save()

      return album
    } catch (error: any) {
      if (error instanceof MongooseError.ValidationError) {
        throw new DatabaseValidationError(
          error.message,
          getValidationErrors(
            error.errors as Record<string, MongooseError.ValidatorError>,
          ),
        )
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public updateOne: IAlbumRepository['updateOne'] = async (filter, payload) => {
    try {
      const { id } = omitUndefined(filter)
      const updates = omitUndefined(payload)

      const defaultOptions: QueryOptions = {
        runValidators: true,
        new: true,
        context: 'query',
      }
      const optionsToApply: QueryOptions = defaultOptions

      const filterById: FilterQuery<IAlbumDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<IAlbumDocument> = { ...filterById }

      const album = await this.album
        .findOneAndUpdate(filterToApply, updates, optionsToApply)
        .orFail()
        .exec()

      return album
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      if (error instanceof MongooseError.ValidationError) {
        throw new DatabaseValidationError(
          error.message,
          getValidationErrors(
            error.errors as Record<string, MongooseError.ValidatorError>,
          ),
        )
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public deleteOne: IAlbumRepository['deleteOne'] = async (filter) => {
    try {
      const { id } = omitUndefined(filter)

      const filterById: FilterQuery<IAlbumDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<IAlbumDocument> = { ...filterById }

      const album = await this.album
        .findOneAndDelete(filterToApply)
        .orFail()
        .exec()

      return album
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public deleteMany: IAlbumRepository['deleteMany'] = async (filter) => {
    try {
      const { ids } = omitUndefined(filter)

      const filterById: FilterQuery<IAlbumDocument> = isEmpty(ids)
        ? {}
        : { _id: { $in: ids } }

      const filterToApply: FilterQuery<IAlbumDocument> = { ...filterById }

      const deletionResult = await this.album.deleteMany(filterToApply).exec()
      return deletionResult
    } catch (error: any) {
      throw new DatabaseUnknownError(error.message)
    }
  }
}

export default AlbumRepository
