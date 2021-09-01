import { CreateTrackHistoryDto } from 'api/trackHistory/dto'
import { ITrackHistoryDocumentArray } from 'api/trackHistory/interface'
import { ITrackHistoryDocument } from 'api/trackHistory/model'

export interface IGetAllTrackHistoryServiceFilter {
  userId: string
}

export interface ICreateTrackHistoryServicePayload
  extends CreateTrackHistoryDto {
  user: string
  listenDate: Date
}

export interface ITrackHistoryService {
  getAll: (
    filter: IGetAllTrackHistoryServiceFilter,
  ) => Promise<ITrackHistoryDocumentArray>

  createOne: (
    payload: ICreateTrackHistoryServicePayload,
  ) => Promise<ITrackHistoryDocument>
}
