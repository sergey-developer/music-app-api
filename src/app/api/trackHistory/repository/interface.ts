import { ITrackHistoryDocumentArray } from 'api/trackHistory/interface'
import { ITrackHistoryDocument } from 'api/trackHistory/model'
import {
  ICreateTrackHistoryServicePayload,
  IGetAllTrackHistoryServiceFilter,
} from 'api/trackHistory/service'
import { DocumentId, DocumentIdArray } from 'database/interface/document'

export interface IFindAllTrackHistoryRepositoryFilter
  extends IGetAllTrackHistoryServiceFilter {}

export interface IDeleteManyTrackHistoryRepositoryFilter
  extends Partial<{
    trackIds: DocumentIdArray
  }> {}

export interface ICreateTrackHistoryRepositoryPayload
  extends ICreateTrackHistoryServicePayload {
  listenDate: string
}

export interface ITrackHistoryRepository {
  findAllWhere: (
    filter: IFindAllTrackHistoryRepositoryFilter,
  ) => Promise<ITrackHistoryDocumentArray>

  createOne: (
    payload: ICreateTrackHistoryRepositoryPayload,
  ) => Promise<ITrackHistoryDocument>

  deleteOneById: (id: DocumentId) => Promise<ITrackHistoryDocument>

  deleteMany: (filter: IDeleteManyTrackHistoryRepositoryFilter) => Promise<void>
}
