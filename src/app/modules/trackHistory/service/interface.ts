import { DeleteResult } from 'mongodb'

import { DocumentId, DocumentIdArray } from 'database/interface/document'
import {
  ITrackHistoryDocument,
  ITrackHistoryDocumentArray,
} from 'database/models/trackHistory'
import { CreateTrackHistoryDto } from 'modules/trackHistory/dto'

export interface IGetAllTrackHistoryFilter
  extends Partial<{
    user: DocumentId
  }> {}

export interface ICreateOneTrackHistoryPayload extends CreateTrackHistoryDto {
  user: DocumentId
}

export interface IDeleteManyTrackHistoryFilter
  extends Partial<{
    trackIds: DocumentIdArray
  }> {}

export interface ITrackHistoryService {
  getAll: (
    filter: IGetAllTrackHistoryFilter,
  ) => Promise<ITrackHistoryDocumentArray>

  createOne: (
    payload: ICreateOneTrackHistoryPayload,
  ) => Promise<ITrackHistoryDocument>

  deleteOneById: (
    id: ITrackHistoryDocument['id'],
  ) => Promise<ITrackHistoryDocument>

  deleteMany: (filter: IDeleteManyTrackHistoryFilter) => Promise<DeleteResult>
}
