import { GetAllRequestsQuery } from 'modules/request/dto'
import { IRequestDocumentArray } from 'modules/request/interface'
import { IRequestDocument } from 'modules/request/model'
import { IRequestRepository } from 'modules/request/repository'

import UpdateRequestDto from '../dto/updateRequest.dto'

export interface IGetAllRequestsFilter extends GetAllRequestsQuery {}

export interface ICreateRequestPayload
  extends Pick<IRequestDocument, 'entityName' | 'entity' | 'creator'> {}

export interface IUpdateRequestPayload extends UpdateRequestDto {}

export interface IRequestService {
  getAll: (filter: IGetAllRequestsFilter) => Promise<IRequestDocumentArray>

  createOne: (payload: ICreateRequestPayload) => Promise<IRequestDocument>

  updateOneById: (
    id: IRequestDocument['id'],
    payload: IUpdateRequestPayload,
  ) => Promise<IRequestDocument>

  deleteOne: IRequestRepository['deleteOne']

  deleteOneWithEntity: (
    requestId: IRequestDocument['id'],
  ) => Promise<IRequestDocument>

  deleteMany: IRequestRepository['deleteMany']
}
