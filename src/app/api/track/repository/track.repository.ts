import _has from 'lodash/has'

import { GetAllTracksFilter } from 'api/track/interface'
import { TrackModel } from 'api/track/model'
import { ITrackRepository } from 'api/track/repository'

class TrackRepository implements ITrackRepository {
  private readonly track: typeof TrackModel

  constructor() {
    this.track = TrackModel
  }

  findAll: ITrackRepository['findAll'] = async () => {
    return this.track.find()
  }

  findAllWhere: ITrackRepository['findAllWhere'] = async (filter) => {
    const filterToApply: GetAllTracksFilter = {}

    if (_has(filter, 'album')) filterToApply.album = filter.album

    if (filter.artist) {
      const tracks = await this.track
        .find(filterToApply, null)
        .populate({ path: 'album', populate: { path: 'artist' } })

      return tracks.filter((track) => track.album.artist.id === filter.artist)
    }

    return this.track.find(filterToApply, null)
  }

  createOne: ITrackRepository['createOne'] = async (payload) => {
    const track = new this.track(payload)
    return track.save()
  }
}

export default new TrackRepository()
