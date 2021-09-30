import _isEmpty from 'lodash/isEmpty'

import { TrackModel } from 'api/track/model'
import { ITrackRepository } from 'api/track/repository'

class TrackRepository implements ITrackRepository {
  private readonly track: typeof TrackModel

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

    const filterByAlbumsIds = filter.albumsIds?.length
      ? { album: { $in: filter.albumsIds } }
      : {}

    const albumFilter = _isEmpty(filterByAlbumsIds)
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
      await this.track.findByIdAndDelete(id).orFail()
    } catch (error) {
      // TODO: throw custom not found if not found
      throw error
    }
  }

  public deleteMany: ITrackRepository['deleteMany'] = async (filter) => {
    if (_isEmpty(filter)) return

    const idFilter = _isEmpty(filter.ids) ? {} : { _id: { $in: filter.ids } }
    const deleteManyFilter = { ...idFilter }

    if (_isEmpty(deleteManyFilter)) return

    try {
      await this.track.deleteMany(deleteManyFilter)
    } catch (error) {
      throw error
    }
  }
}

export default new TrackRepository()
