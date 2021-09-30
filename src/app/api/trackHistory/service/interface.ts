import { CreateTrackHistoryDto } from 'api/trackHistory/dto'
import { ITrackHistoryDocumentArray } from 'api/trackHistory/interface'
import { ITrackHistoryDocument } from 'api/trackHistory/model'
import {
  IDeleteManyTrackHistoryRepositoryFilter,
  ITrackHistoryRepository,
} from 'api/trackHistory/repository'
import { IUserDocument } from 'api/user/model'
import { DocumentId } from 'database/interface/document'

export interface IGetAllTrackHistoryServiceFilter {
  user: DocumentId<IUserDocument>
}

export interface ICreateTrackHistoryServicePayload
  extends CreateTrackHistoryDto {
  user: DocumentId<IUserDocument>
  listenDate: Date
}

export interface ITrackHistoryService {
  getAll: (
    filter: IGetAllTrackHistoryServiceFilter,
  ) => Promise<ITrackHistoryDocumentArray>

  createOne: (
    payload: ICreateTrackHistoryServicePayload,
  ) => Promise<ITrackHistoryDocument>

  deleteMany: ITrackHistoryRepository['deleteMany']
}
