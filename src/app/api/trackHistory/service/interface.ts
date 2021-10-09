import { CreateTrackHistoryDto } from 'api/trackHistory/dto'
import { ITrackHistoryDocumentArray } from 'api/trackHistory/interface'
import { ITrackHistoryDocument } from 'api/trackHistory/model'
import { ITrackHistoryRepository } from 'api/trackHistory/repository'
import { DocumentId } from 'database/interface/document'

export interface IGetAllTrackHistoryServiceFilter {
  userId: DocumentId
}

export interface ICreateTrackHistoryServicePayload
  extends CreateTrackHistoryDto {
  userId: DocumentId
}

export interface ITrackHistoryService {
  getAll: (
    filter: IGetAllTrackHistoryServiceFilter,
  ) => Promise<ITrackHistoryDocumentArray>

  createOne: (
    payload: ICreateTrackHistoryServicePayload,
  ) => Promise<ITrackHistoryDocument>

  deleteOneById: ITrackHistoryRepository['deleteOneById']

  deleteMany: ITrackHistoryRepository['deleteMany']
}
