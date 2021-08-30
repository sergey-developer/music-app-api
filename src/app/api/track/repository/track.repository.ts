import _has from 'lodash/has'

import { GetAllTracksFilter } from 'api/track/interface'
import { TrackModel } from 'api/track/model'
import { ITrackRepository } from 'api/track/repository'

class TrackRepository implements ITrackRepository {
  private readonly track: typeof TrackModel

  public constructor() {
    this.track = TrackModel
  }

  public findAll: ITrackRepository['findAll'] = async () => {
    return this.track.find()
  }

  public findAllWhere: ITrackRepository['findAllWhere'] = async (filter) => {
    const filterToApply: GetAllTracksFilter = {}

    if (_has(filter, 'album')) filterToApply.album = filter.album

    if (filter.artist) {
      return this.track.findByArtistId(filter.artist, filterToApply)
    }

    return this.track.find(filterToApply, null)
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
}

export default new TrackRepository()
