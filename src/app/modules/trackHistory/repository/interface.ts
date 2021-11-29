import { DeleteResult } from 'mongodb'

import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { CreateTrackHistoryDto } from 'modules/trackHistory/dto'
import { ITrackHistoryDocumentArray } from 'modules/trackHistory/interface'
import { ITrackHistoryDocument } from 'modules/trackHistory/model'

export interface IFindAllTrackHistoryFilter
  extends Partial<{
    user: DocumentId
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
