import { CreateTrackHistoryDto } from 'api/trackHistory/dto'
import { ITrackHistoryDocumentArray } from 'api/trackHistory/interface'
import { ITrackHistoryDocument } from 'api/trackHistory/model'
import { IUserDocument } from 'api/user/model'
import { DocumentId } from 'database/interface/document'

export interface IGetAllTrackHistoryServiceFilter {
  userId: DocumentId<IUserDocument>
}

export interface ICreateTrackHistoryServicePayload
  extends CreateTrackHistoryDto {
  user: DocumentId<IUserDocument>
}

export interface ITrackHistoryService {
  getAll: (
    filter: IGetAllTrackHistoryServiceFilter,
  ) => Promise<ITrackHistoryDocumentArray>

  createOne: (
    payload: ICreateTrackHistoryServicePayload,
  ) => Promise<ITrackHistoryDocument>
}
