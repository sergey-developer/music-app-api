import { CreateTrackDto } from 'api/track/dto'
import { ITrackDocumentArray } from 'api/track/interface'
import { ITrackDocument } from 'api/track/model'
import { IGetAllTracksServiceFilter } from 'api/track/service'
import { DocumentId, DocumentIdArray } from 'database/interface/document'

export interface IGetAllTracksRepositoryFilter
  extends Pick<IGetAllTracksServiceFilter, 'artist' | 'albumIds'>,
    Partial<{
      ids: DocumentIdArray
    }> {}

export interface IDeleteManyTracksRepositoryFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface ICreateTrackRepositoryPayload extends CreateTrackDto {}

export interface ITrackRepository {
  findAllWhere: (
    filter: IGetAllTracksRepositoryFilter,
  ) => Promise<ITrackDocumentArray>

  createOne: (payload: ICreateTrackRepositoryPayload) => Promise<ITrackDocument>

  deleteOneById: (id: DocumentId) => Promise<ITrackDocument>

  deleteMany: (filter: IDeleteManyTracksRepositoryFilter) => Promise<void>
}
