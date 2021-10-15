import { DocumentId } from 'database/interface/document'
import { CreateTrackHistoryDto } from 'modules/trackHistory/dto'
import { ITrackHistoryDocumentArray } from 'modules/trackHistory/interface'
import { ITrackHistoryDocument } from 'modules/trackHistory/model'
import { ITrackHistoryRepository } from 'modules/trackHistory/repository'

export interface IGetAllTrackHistoryFilter {
  userId: DocumentId
}

export interface ICreateTrackHistoryPayload extends CreateTrackHistoryDto {
  userId: DocumentId
}

export interface ITrackHistoryService {
  getAll: (
    filter: IGetAllTrackHistoryFilter,
  ) => Promise<ITrackHistoryDocumentArray>

  create: (
    payload: ICreateTrackHistoryPayload,
  ) => Promise<ITrackHistoryDocument>

  deleteOneById: ITrackHistoryRepository['deleteOneById']

  deleteMany: ITrackHistoryRepository['deleteMany']
}
