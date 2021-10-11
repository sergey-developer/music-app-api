import { DocumentId } from 'database/interface/document'
import { CreateTrackHistoryDto } from 'modules/trackHistory/dto'
import { ITrackHistoryDocumentArray } from 'modules/trackHistory/interface'
import { ITrackHistoryDocument } from 'modules/trackHistory/model'
import { ITrackHistoryRepository } from 'modules/trackHistory/repository'

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
