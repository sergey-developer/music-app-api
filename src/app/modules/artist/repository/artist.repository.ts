import isEmpty from 'lodash/isEmpty'
import { FilterQuery, Error as MongooseError, QueryOptions } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import { NotFoundError, UnknownError, ValidationError } from 'database/errors'
import getModelName from 'database/utils/getModelName'
import { IArtistDocument, IArtistModel } from 'modules/artist/model'
import { IArtistRepository } from 'modules/artist/repository'
import { ITrackDocument } from 'modules/track/model'
import { omitUndefined } from 'shared/utils/common'
import { getValidationErrors } from 'shared/utils/errors/validationErrors'

@singleton()
class ArtistRepository implements IArtistRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.Artist))
    private readonly artist: IArtistModel,
  ) {}

  public findAllWhere: IArtistRepository['findAllWhere'] = async (filter) => {
    try {
      const { ids } = omitUndefined(filter)

      const filterById: FilterQuery<IArtistDocument> = isEmpty(ids)
        ? {}
        : { _id: { $in: ids } }

      const filterToApply: FilterQuery<IArtistDocument> = { ...filterById }

      return this.artist.find(filterToApply).exec()
    } catch (error: any) {
      throw new UnknownError(error.message)
    }
  }

  public findOne: IArtistRepository['findOne'] = async (filter) => {
    try {
      const { id } = omitUndefined(filter)

      const filterById: FilterQuery<ITrackDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<ITrackDocument> = { ...filterById }

      return this.artist.findOne(filterToApply).orFail().exec()
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new NotFoundError(error.message)
      }

      throw new UnknownError(error.message)
    }
  }

  public createOne: IArtistRepository['createOne'] = async (payload) => {
    try {
      const artist = new this.artist(payload)
      return artist.save()
    } catch (error: any) {
      if (error instanceof MongooseError.ValidationError) {
        throw new ValidationError(
          error.message,
          getValidationErrors(
            error.errors as Record<string, MongooseError.ValidatorError>,
          ),
        )
      }

      throw new UnknownError(error.message)
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

      return this.artist
        .findOneAndUpdate(filterToApply, updates, optionsToApply)
        .orFail()
        .exec()
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new NotFoundError(error.message)
      }

      if (error instanceof MongooseError.ValidationError) {
        throw new ValidationError(
          error.message,
          getValidationErrors(
            error.errors as Record<string, MongooseError.ValidatorError>,
          ),
        )
      }

      throw new UnknownError(error.message)
    }
  }

  public deleteOne: IArtistRepository['deleteOne'] = async (filter) => {
    try {
      const { id } = omitUndefined(filter)

      const filterById: FilterQuery<ITrackDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<ITrackDocument> = { ...filterById }

      return this.artist
        .findOneAndDelete(filterToApply)
        .orFail()
        .populate('photo')
        .exec()
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new NotFoundError(error.message)
      }

      throw new UnknownError(error.message)
    }
  }
}

export default ArtistRepository
