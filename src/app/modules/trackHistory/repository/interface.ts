import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { CreateTrackHistoryDto } from 'modules/trackHistory/dto'
import { ITrackHistoryDocumentArray } from 'modules/trackHistory/interface'
import { ITrackHistoryDocument } from 'modules/trackHistory/model'

export interface IFindAllTrackHistoryFilter {
  userId: DocumentId
}

export interface IDeleteManyTrackHistoryFilter
  extends Partial<{
    trackIds: DocumentIdArray
  }> {}

export interface ICreateTrackHistoryPayload extends CreateTrackHistoryDto {
  userId: DocumentId
  listenDate: string
}

export interface ITrackHistoryRepository {
  findAllWhere: (
    filter: IFindAllTrackHistoryFilter,
  ) => Promise<ITrackHistoryDocumentArray>

  create: (
    payload: ICreateTrackHistoryPayload,
  ) => Promise<ITrackHistoryDocument>

  deleteOneById: (
    id: ITrackHistoryDocument['id'],
  ) => Promise<ITrackHistoryDocument>

  deleteMany: (filter: IDeleteManyTrackHistoryFilter) => Promise<void>
}
