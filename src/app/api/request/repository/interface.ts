import { GetAllRequestsFilterDto } from 'api/request/dto'
import {
  ICreateRequestPayload,
  RequestDocumentArray,
} from 'api/request/interface'
import { IRequestDocument } from 'api/request/model'

export interface IRequestRepository {
  findAllWhere: (
    filter: GetAllRequestsFilterDto,
  ) => Promise<RequestDocumentArray>
  createOne: (payload: ICreateRequestPayload) => Promise<IRequestDocument>
}
