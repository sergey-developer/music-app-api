import { CreateTrackDto } from 'api/track/dto'
import { GetAllTracksQueryString, TrackModelArray } from 'api/track/interface'
import { ITrackModel } from 'api/track/model'

export interface ITrackRepository {
  findAll: () => Promise<TrackModelArray>
  findAllWhere: (filter: GetAllTracksQueryString) => Promise<TrackModelArray>
  createOne: (payload: CreateTrackDto) => Promise<ITrackModel>
}
