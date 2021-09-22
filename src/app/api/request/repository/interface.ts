import { IRequestDocumentArray } from 'api/request/interface'
import { IRequestDocument } from 'api/request/model'
import { IGetAllRequestsServiceFilter } from 'api/request/service'
import { DocumentId } from 'database/interface/document'
import { MaybeNull } from 'shared/interface/utils/common'

export interface ICreateRequestRepositoryPayload
  extends Pick<
    IRequestDocument,
    'status' | 'reason' | 'entityName' | 'entity' | 'creator'
  > {}

export interface IFindAllRequestsRepositoryFilter
  extends IGetAllRequestsServiceFilter {}

export interface IRequestRepository {
  findAllWhere: (
    filter: IFindAllRequestsRepositoryFilter,
  ) => Promise<IRequestDocumentArray>

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
