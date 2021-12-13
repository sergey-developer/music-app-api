import { DeleteResult } from 'mongodb'

import { DocumentId, DocumentIdArray } from 'database/interface/document'
import {
  ITrackHistoryDocument,
  ITrackHistoryDocumentArray,
} from 'database/models/trackHistory'
import { CreateTrackHistoryDto } from 'modules/trackHistory/dto'

export interface IFindAllTrackHistoryFilter
  extends Partial<{
    user: DocumentId
    track: DocumentId
  }> {}

export interface IDeleteOneTrackHistoryFilter
  extends Partial<{
    id: ITrackHistoryDocument['id']
  }> {}

export interface IDeleteManyTrackHistoryFilter
  extends Partial<{
    trackIds: DocumentIdArray
  }> {}

export interface ICreateOneTrackHistoryPayload extends CreateTrackHistoryDto {
  user: DocumentId
  listenDate: ITrackHistoryDocument['listenDate']
}

export interface ITrackHistoryRepository {
  findAllWhere: (
    filter: IFindAllTrackHistoryFilter,
  ) => Promise<ITrackHistoryDocumentArray>

  createOne: (
    payload: ICreateOneTrackHistoryPayload,
  ) => Promise<ITrackHistoryDocument>

  deleteOne: (
    filter: IDeleteOneTrackHistoryFilter,
  ) => Promise<ITrackHistoryDocument>

  deleteMany: (filter: IDeleteManyTrackHistoryFilter) => Promise<DeleteResult>
}
