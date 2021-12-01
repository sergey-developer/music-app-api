import isEmpty from 'lodash/isEmpty'
import { FilterQuery, Error as MongooseError, QueryOptions } from 'mongoose'
import { inject, singleton } from 'tsyringe'

import { omitUndefined } from 'app/utils/common'
import { EntityNamesEnum } from 'database/constants'
import {
  DatabaseNotFoundError,
  DatabaseUnknownError,
  DatabaseValidationError,
} from 'database/errors'
import { ITrackDocument, ITrackModel } from 'database/models/track'
import { getValidationErrors } from 'database/utils/errors'
import getModelName from 'database/utils/getModelName'
import { ITrackRepository } from 'modules/track/repository'

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

      let tracks

      if (artist) {
        const tracks = await this.track.findByArtistId(artist, filterToApply)
        return tracks
      }

      tracks = await this.track.find(filterToApply).exec()
      return tracks
    } catch (error: any) {
      throw new DatabaseUnknownError(error.message)
    }
  }

  public findOne: ITrackRepository['findOne'] = async (filter) => {
    try {
      const { id } = omitUndefined(filter)

      const filterById: FilterQuery<ITrackDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<ITrackDocument> = { ...filterById }

      const track = await this.track.findOne(filterToApply).orFail().exec()
      return track
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public createOne: ITrackRepository['createOne'] = async (payload) => {
    try {
      const newTrack = new this.track(payload)
      const track = await newTrack.save()
      return track
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

      const track = await this.track
        .findOneAndUpdate(filterToApply, updates, optionsToApply)
        .orFail()
        .exec()

      return track
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

  public deleteOne: ITrackRepository['deleteOne'] = async (filter) => {
    try {
      const { id } = omitUndefined(filter)

      const filterById: FilterQuery<ITrackDocument> = id ? { _id: id } : {}
      const filterToApply: FilterQuery<ITrackDocument> = { ...filterById }

      const track = await this.track
        .findOneAndDelete(filterToApply)
        .orFail()
        .exec()

      return track
    } catch (error: any) {
      if (error instanceof MongooseError.DocumentNotFoundError) {
        throw new DatabaseNotFoundError(error.message)
      }

      throw new DatabaseUnknownError(error.message)
    }
  }

  public deleteMany: ITrackRepository['deleteMany'] = async (filter) => {
    try {
      const { ids } = omitUndefined(filter)

      const filterById: FilterQuery<ITrackDocument> = isEmpty(ids)
        ? {}
        : { _id: { $in: ids } }

      const filterToApply: FilterQuery<ITrackDocument> = { ...filterById }

      const deletionResult = await this.track.deleteMany(filterToApply).exec()
      return deletionResult
    } catch (error: any) {
      throw new DatabaseUnknownError(error.message)
    }
  }
}

export default TrackRepository
