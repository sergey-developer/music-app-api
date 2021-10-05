import { IRequestDocumentArray } from 'api/request/interface'
import { IRequestDocument } from 'api/request/model'
import {
  ICreateOneRequestServicePayload,
  IGetAllRequestsServiceFilter,
} from 'api/request/service'
import { DocumentId } from 'database/interface/document'
import { MaybeNull } from 'shared/interface/utils/common'

export interface ICreateOneRequestRepositoryPayload
  extends ICreateOneRequestServicePayload {}

export interface IFindAllRequestsRepositoryFilter
  extends IGetAllRequestsServiceFilter {}

export interface IRequestRepository {
  findAllWhere: (
    filter: IFindAllRequestsRepositoryFilter,
  ) => Promise<IRequestDocumentArray>

  createOne: (
    payload: ICreateOneRequestRepositoryPayload,
  ) => Promise<IRequestDocument>

  findOneById: (
    id: DocumentId<IRequestDocument>,
  ) => Promise<MaybeNull<IRequestDocument>>

  deleteOneById: (id: DocumentId<IRequestDocument>) => Promise<IRequestDocument>
}
