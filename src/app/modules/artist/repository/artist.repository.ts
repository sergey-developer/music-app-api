import isEmpty from 'lodash/isEmpty'
import { FilterQuery, Error as MongooseError, QueryOptions } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import { omitUndefined } from 'app/utils/common'
import {
  DatabaseNotFoundError,
  DatabaseUnknownError,
  DatabaseValidationError,
} from 'database/errors'
import { IArtistDocument, IArtistModel } from 'database/models/artist'
import { getValidationErrors } from 'database/utils/errors'
import { DiTokenEnum } from 'lib/dependency-injection'
import { IArtistRepository } from 'modules/artist/repository'

@singleton()
class ArtistRepository implements IArtistRepository {
  public constructor(
    @inject(DiTokenEnum.Artist)
    private readonly artist: IArtistModel,
  ) {}

  public findAllWhere: IArtistRepository['findAllWhere'] = async (filter) => {
    try {
      const { ids } = omitUndefined(filter)

      const filterById: FilterQuery<IArtistDocument> = isEmpty(ids)
        ? {}
        : { _id: { $in: ids } }

      const filterToApply: FilterQuery<IArtistDocument> = { ...filterById }

      const artists = await this.artist.find(filterToApply).exec()
      return artists
    } catch (error: any) {
      throw new DatabaseUnknownError(error.message)
    }
  }

  public findOne: IArtistRepository['findOne'] = async (filter) => {
    try {
      const { id } = omitUndefined(filter)

      const filterById: FilterQuery<IArtistDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<IArtistDocument> = { ...filterById }

      const artist = await this.artist.findOne(filterToApply).orFail().exec()
      return artist
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public createOne: IArtistRepository['createOne'] = async (payload) => {
    try {
      const newArtist = new this.artist(payload)
      const artist = await newArtist.save()

      return artist
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

  public updateOne: IArtistRepository['updateOne'] = async (
    filter,
    payload,
  ) => {
    try {
      const { id } = omitUndefined(filter)
      const updates = omitUndefined(payload)

      const defaultOptions: QueryOptions = {
        runValidators: true,
        new: true,
        context: 'query',
      }
      const optionsToApply: QueryOptions = defaultOptions

      const filterById: FilterQuery<IArtistDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<IArtistDocument> = { ...filterById }

      const artist = await this.artist
        .findOneAndUpdate(filterToApply, updates, optionsToApply)
        .orFail()
        .exec()

      return artist
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

  public deleteOne: IArtistRepository['deleteOne'] = async (filter) => {
    try {
      const { id } = omitUndefined(filter)

      const filterById: FilterQuery<IArtistDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<IArtistDocument> = { ...filterById }

      const artist = await this.artist
        .findOneAndDelete(filterToApply)
        .orFail()
        .populate('photo')
        .exec()

      return artist
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }
}

export default ArtistRepository
