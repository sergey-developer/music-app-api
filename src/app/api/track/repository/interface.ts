import { CreateTrackDto } from 'api/track/dto'
import { TrackDocumentArray } from 'api/track/interface'
import { ITrackDocument } from 'api/track/model'
import { IGetAllTracksServiceFilter } from 'api/track/service'
import { DocumentId } from 'database/interface/document'

export interface IGetAllTracksRepositoryFilter
  extends IGetAllTracksServiceFilter {}

export interface ICreateTrackRepositoryPayload extends CreateTrackDto {}

export interface ITrackRepository {
  findAll: () => Promise<TrackDocumentArray>

  findAllWhere: (
    filter: IGetAllTracksRepositoryFilter,
  ) => Promise<TrackDocumentArray>

  createOne: (payload: ICreateTrackRepositoryPayload) => Promise<ITrackDocument>

  deleteOneById: (id: DocumentId<ITrackDocument>) => Promise<void>
}
