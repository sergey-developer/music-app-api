import { DocumentId, DocumentIdArray } from 'database/interface/document'
import {
  CreateTrackDto,
  GetAllTracksQuery,
  UpdateTrackDto,
} from 'modules/track/dto'
import { ITrackDocumentArray } from 'modules/track/interface'
import { ITrackDocument } from 'modules/track/model'

export interface IGetAllTracksFilter
  extends Pick<GetAllTracksQuery, 'artist'>,
    Partial<{
      ids: DocumentIdArray
      albumIds: DocumentIdArray
    }> {}

export interface IUpdateTrackPayload extends UpdateTrackDto {}

export interface IUpdateTrackFilter
  extends Partial<{
    id: DocumentId
  }> {}

export interface IDeleteManyTracksFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface ICreateTrackPayload extends CreateTrackDto {}

export interface ITrackRepository {
  findAllWhere: (filter: IGetAllTracksFilter) => Promise<ITrackDocumentArray>

  findOneById: (id: DocumentId) => Promise<ITrackDocument>

  create: (payload: ICreateTrackPayload) => Promise<ITrackDocument>

  update: (
    filter: IUpdateTrackFilter,
    payload: IUpdateTrackPayload,
  ) => Promise<void>

  deleteOneById: (id: DocumentId) => Promise<ITrackDocument>

  deleteMany: (filter: IDeleteManyTracksFilter) => Promise<void>
}
