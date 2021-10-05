import { ITrackDocument } from 'api/track/model'
import { ITrackHistoryDocumentArray } from 'api/trackHistory/interface'
import { ITrackHistoryDocument } from 'api/trackHistory/model'
import {
  ICreateTrackHistoryServicePayload,
  IGetAllTrackHistoryServiceFilter,
} from 'api/trackHistory/service'
import { DocumentId } from 'database/interface/document'

export interface IFindAllTrackHistoryRepositoryFilter
  extends IGetAllTrackHistoryServiceFilter {}

export interface IDeleteManyTrackHistoryRepositoryFilter
  extends Partial<{
    tracksIds: Array<DocumentId<ITrackDocument>>
  }> {}

export interface ICreateTrackHistoryRepositoryPayload
  extends ICreateTrackHistoryServicePayload {}

export interface ITrackHistoryRepository {
  findAllWhere: (
    filter: IFindAllTrackHistoryRepositoryFilter,
  ) => Promise<ITrackHistoryDocumentArray>

  createOne: (
    payload: ICreateTrackHistoryRepositoryPayload,
  ) => Promise<ITrackHistoryDocument>

  deleteOneById: (
    id: DocumentId<ITrackHistoryDocument>,
  ) => Promise<ITrackHistoryDocument>

  deleteMany: (filter: IDeleteManyTrackHistoryRepositoryFilter) => Promise<void>
}
