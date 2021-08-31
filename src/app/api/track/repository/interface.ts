import { CreateTrackDto, GetAllTracksFilterDto } from 'api/track/dto'
import { TrackDocumentArray } from 'api/track/interface'
import { ITrackDocument } from 'api/track/model'
import { DocumentId } from 'database/interface/document'

export interface IGetAllTracksRepositoryFilter
  extends Partial<Pick<GetAllTracksFilterDto, 'album'>> {}

export interface ICreateTrackRepositoryPayload extends CreateTrackDto {}

export interface ITrackRepository {
  findAll: () => Promise<TrackDocumentArray>
  findAllWhere: (filter: GetAllTracksFilterDto) => Promise<TrackDocumentArray>
  createOne: (payload: ICreateTrackRepositoryPayload) => Promise<ITrackDocument>
  deleteOneById: (id: DocumentId<ITrackDocument>) => Promise<void>
}
