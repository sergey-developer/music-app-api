import isEmpty from 'lodash/isEmpty'

import { ITrackModel, TrackModel } from 'api/track/model'
import { ITrackRepository } from 'api/track/repository'
import { isNotFoundDatabaseError } from 'database/utils/errors'
import { createNotFoundError } from 'shared/utils/errors/httpErrors'

class TrackRepository implements ITrackRepository {
  private readonly track: ITrackModel

  public constructor() {
    this.track = TrackModel
  }

  public findAll: ITrackRepository['findAll'] = async () => {
    return this.track.find().exec()
  }

  public findAllWhere: ITrackRepository['findAllWhere'] = async (filter) => {
    if (filter.artist) {
      return this.track.findByArtistId(filter.artist)
    }

    const filterByAlbum = filter.album ? { album: filter.album } : {}

    const filterByAlbumsIds = filter.albumIds?.length
      ? { album: { $in: filter.albumIds } }
      : {}

    const albumFilter = isEmpty(filterByAlbumsIds)
      ? filterByAlbum
      : filterByAlbumsIds

    const findFilter = { ...albumFilter }

    return this.track.find(findFilter).exec()
  }

  public createOne: ITrackRepository['createOne'] = async (payload) => {
    const track = new this.track(payload)
    return track.save()
  }

  public deleteOneById: ITrackRepository['deleteOneById'] = async (id) => {
    try {
      const deletedTrack = await this.track
        .findByIdAndDelete(id)
        .orFail()
        .exec()

      return deletedTrack
    } catch (error) {
      throw isNotFoundDatabaseError(error) ? createNotFoundError() : error
    }
  }

  public deleteMany: ITrackRepository['deleteMany'] = async (filter) => {
    const idFilter = isEmpty(filter.ids) ? {} : { _id: { $in: filter.ids } }
    const deleteManyFilter = { ...idFilter }

    try {
      await this.track.deleteMany(deleteManyFilter).orFail()
    } catch (error) {
      // TODO: handle error
      throw error
    }
  }
}

export default new TrackRepository()
