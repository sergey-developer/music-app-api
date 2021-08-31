import { GetAllRequestsFilterDto } from 'api/request/dto'
import { RequestDocumentArray } from 'api/request/interface'
import { IRequestDocument } from 'api/request/model'
import { DocumentId } from 'database/interface/document'
import { MaybeNull } from 'shared/interface/utils/common'

export interface ICreateRequestRepositoryPayload
  extends Pick<
    IRequestDocument,
    'status' | 'reason' | 'entityName' | 'entity' | 'creator'
  > {}

export interface IRequestRepository {
  findAllWhere: (
    filter: GetAllRequestsFilterDto,
  ) => Promise<RequestDocumentArray>

  createOne: (
    payload: ICreateRequestRepositoryPayload,
  ) => Promise<IRequestDocument>

  findOneById: (
    id: DocumentId<IRequestDocument>,
  ) => Promise<MaybeNull<IRequestDocument>>

  findOneByIdAndDelete: (
    id: DocumentId<IRequestDocument>,
  ) => Promise<IRequestDocument>
}
