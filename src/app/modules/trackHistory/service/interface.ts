import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { CreateTrackHistoryDto } from 'modules/trackHistory/dto'
import { ITrackHistoryDocumentArray } from 'modules/trackHistory/interface'
import { ITrackHistoryDocument } from 'modules/trackHistory/model'

export interface IGetAllTrackHistoryFilter
  extends Partial<{
    user: DocumentId
  }> {}

export interface ICreateTrackHistoryPayload extends CreateTrackHistoryDto {
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
    payload: ICreateTrackHistoryPayload,
  ) => Promise<ITrackHistoryDocument>

  deleteOneById: (
    id: ITrackHistoryDocument['id'],
  ) => Promise<ITrackHistoryDocument>

  deleteMany: (filter: IDeleteManyTrackHistoryFilter) => Promise<void>
}
