import { CreateTrackDto, GetAllTracksFilterDto } from 'api/track/dto'
import { TrackDocumentArray } from 'api/track/interface'
import { ITrackDocument } from 'api/track/model'
import { DocumentId } from 'database/interface/document'

export interface ITrackRepository {
  findAll: () => Promise<TrackDocumentArray>
  findAllWhere: (filter: GetAllTracksFilterDto) => Promise<TrackDocumentArray>
  createOne: (payload: CreateTrackDto) => Promise<ITrackDocument>
  deleteOneById: (id: DocumentId<ITrackDocument>) => Promise<void>
}
