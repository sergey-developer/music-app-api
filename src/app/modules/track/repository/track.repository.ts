import isEmpty from 'lodash/isEmpty'
import { FilterQuery, Error as MongooseError, QueryOptions } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import DatabaseError from 'database/errors'
import getModelName from 'database/utils/getModelName'
import { ITrackDocument, ITrackModel } from 'modules/track/model'
import { ITrackRepository } from 'modules/track/repository'
import { omitUndefined } from 'shared/utils/common'
import { getValidationErrors } from 'shared/utils/errors/validationErrors'

@singleton()
class TrackRepository implements ITrackRepository {
  public constructor(
    @inject(getModelName(EntityNamesEnum.Track))
    private readonly track: ITrackModel,
  ) {}

  public findAllWhere: ITrackRepository['findAllWhere'] = async (filter) => {
    try {
      const { artist, albumIds, ids } = omitUndefined(filter)

      const filterById: FilterQuery<ITrackDocument> = isEmpty(ids)
        ? {}
        : { _id: { $in: ids } }

      const filterByAlbum: FilterQuery<ITrackDocument> = isEmpty(albumIds)
        ? {}
        : { album: { $in: albumIds } }

      const filterToApply: FilterQuery<ITrackDocument> = {
        ...filterById,
        ...filterByAlbum,
      }

      if (artist) {
        return this.track.findByArtistId(artist, filterToApply)
      }

      return this.track.find(filterToApply).exec()
    } catch (error: any) {
      throw new DatabaseError.UnknownError(error.message)
    }
  }

  public findOne: ITrackRepository['findOne'] = async (filter) => {
    try {
      const { id } = omitUndefined(filter)

      const filterById: FilterQuery<ITrackDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<ITrackDocument> = { ...filterById }

      return this.track.findOne(filterToApply).orFail().exec()
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseError.NotFoundError(error.message)
      }

      throw new DatabaseError.UnknownError(error.message)
    }
  }

  public createOne: ITrackRepository['createOne'] = async (payload) => {
    try {
      const track = new this.track(payload)
      return track.save()
    } catch (error: any) {
      if (error instanceof MongooseError.ValidationError) {
        throw new DatabaseError.ValidationError(
          error.message,
          getValidationErrors(
            error.errors as Record<string, MongooseError.ValidatorError>,
          ),
        )
      }

      throw new DatabaseError.UnknownError(error.message)
    }
  }

  public updateOne: ITrackRepository['updateOne'] = async (filter, payload) => {
    try {
      const { id } = omitUndefined(filter)
      const updates = omitUndefined(payload)

      const defaultOptions: QueryOptions = {
        runValidators: true,
        new: true,
        context: 'query',
      }
      const optionsToApply: QueryOptions = defaultOptions

      const filterById: FilterQuery<ITrackDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<ITrackDocument> = { ...filterById }

      return this.track
        .findOneAndUpdate(filterToApply, updates, optionsToApply)
        .orFail()
        .exec()
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseError.NotFoundError(error.message)
      }

      if (error instanceof MongooseError.ValidationError) {
        throw new DatabaseError.ValidationError(
          error.message,
          getValidationErrors(
            error.errors as Record<string, MongooseError.ValidatorError>,
          ),
        )
      }

      throw new DatabaseError.UnknownError(error.message)
    }
  }

  public deleteOne: ITrackRepository['deleteOne'] = async (filter) => {
    try {
      const { id } = omitUndefined(filter)

      const filterById: FilterQuery<ITrackDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<ITrackDocument> = { ...filterById }

      return this.track.findOneAndDelete(filterToApply).orFail().exec()
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseError.NotFoundError(error.message)
      }

      throw new DatabaseError.UnknownError(error.message)
    }
  }

  public deleteMany: ITrackRepository['deleteMany'] = async (filter) => {
    try {
      const { ids } = omitUndefined(filter)

      const filterById: FilterQuery<ITrackDocument> = isEmpty(ids)
        ? {}
        : { _id: { $in: ids } }

      const filterToApply: FilterQuery<ITrackDocument> = { ...filterById }

      return this.track.deleteMany(filterToApply).exec()
    } catch (error: any) {
      throw new DatabaseError.UnknownError(error.message)
    }
  }
}

export default TrackRepository
