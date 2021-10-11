import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { CreateTrackDto } from 'modules/track/dto'
import { ITrackDocumentArray } from 'modules/track/interface'
import { ITrackDocument } from 'modules/track/model'
import { IGetAllTracksServiceFilter } from 'modules/track/service'

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
