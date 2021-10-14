import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { ITrackHistoryDocumentArray } from 'modules/trackHistory/interface'
import { ITrackHistoryDocument } from 'modules/trackHistory/model'
import {
  ICreateTrackHistoryServicePayload,
  IGetAllTrackHistoryServiceFilter,
} from 'modules/trackHistory/service'

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

  create: (
    payload: ICreateTrackHistoryRepositoryPayload,
  ) => Promise<ITrackHistoryDocument>

  deleteOneById: (id: DocumentId) => Promise<ITrackHistoryDocument>

  deleteMany: (filter: IDeleteManyTrackHistoryRepositoryFilter) => Promise<void>
}
