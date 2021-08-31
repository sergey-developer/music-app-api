import { ITrackHistoryDocumentArray } from 'api/trackHistory/interface'
import { ITrackHistoryDocument } from 'api/trackHistory/model'
import {
  ICreateTrackHistoryServicePayload,
  IGetAllTrackHistoryServiceFilter,
} from 'api/trackHistory/service'

export interface IFindAllTrackHistoryRepositoryFilter
  extends IGetAllTrackHistoryServiceFilter {}

export interface ICreateTrackHistoryRepositoryPayload
  extends ICreateTrackHistoryServicePayload {}

export interface ITrackHistoryRepository {
  findAllWhere: (
    filter: IFindAllTrackHistoryRepositoryFilter,
  ) => Promise<ITrackHistoryDocumentArray>

  createOne: (
    payload: ICreateTrackHistoryRepositoryPayload,
  ) => Promise<ITrackHistoryDocument>
}
