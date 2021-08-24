import { CreateTrackDto } from 'api/track/dto'
import { GetAllTracksFilterDto, TrackModelArray } from 'api/track/interface'
import { ITrackModel } from 'api/track/model'

export interface ITrackRepository {
  findAll: () => Promise<TrackModelArray>
  findAllWhere: (filter: GetAllTracksFilterDto) => Promise<TrackModelArray>
  createOne: (payload: CreateTrackDto) => Promise<ITrackModel>
}
