import { DocumentId } from 'database/interface/document'
import { CreateTrackHistoryDto } from 'modules/trackHistory/dto'
import { ITrackHistoryDocumentArray } from 'modules/trackHistory/interface'
import { ITrackHistoryDocument } from 'modules/trackHistory/model'
import { ITrackHistoryRepository } from 'modules/trackHistory/repository'

export interface IGetAllTrackHistoryFilter {
  user: DocumentId
}

export interface ICreateTrackHistoryPayload extends CreateTrackHistoryDto {
  user: DocumentId
}

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

  deleteMany: ITrackHistoryRepository['deleteMany']
}
