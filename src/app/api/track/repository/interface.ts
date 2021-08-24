import { CreateTrackDto } from 'api/track/dto'
import { GetAllTracksFilterDto, TrackDocumentArray } from 'api/track/interface'
import { ITrackDocument } from 'api/track/model'

export interface ITrackRepository {
  findAll: () => Promise<TrackDocumentArray>
  findAllWhere: (filter: GetAllTracksFilterDto) => Promise<TrackDocumentArray>
  createOne: (payload: CreateTrackDto) => Promise<ITrackDocument>
}
