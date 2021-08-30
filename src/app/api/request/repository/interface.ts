import { GetAllRequestsFilterDto } from 'api/request/dto'
import {
  ICreateRequestPayload,
  RequestDocumentArray,
} from 'api/request/interface'
import { IRequestDocument } from 'api/request/model'
import { DocumentId } from 'database/interface/document'
import { MaybeNull } from 'shared/interface/utils/common'

export interface IRequestRepository {
  findAllWhere: (
    filter: GetAllRequestsFilterDto,
  ) => Promise<RequestDocumentArray>
  createOne: (payload: ICreateRequestPayload) => Promise<IRequestDocument>
  findOneById: (
    id: DocumentId<IRequestDocument>,
  ) => Promise<MaybeNull<IRequestDocument>>
  findOneByIdAndDelete: (
    id: DocumentId<IRequestDocument>,
  ) => Promise<IRequestDocument>
}
