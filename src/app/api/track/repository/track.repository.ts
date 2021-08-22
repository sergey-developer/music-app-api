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
    const conditions = filter.album ? { album: filter.album } : {}

    if (filter.artist) {
      return this.track.find(conditions).populate('album').populate('artist')
    }

    return this.track.find(conditions)
  }

  createOne: ITrackRepository['createOne'] = async (payload) => {
    const track = new this.track(payload)
    return track.save()
  }
}

export default new TrackRepository()
