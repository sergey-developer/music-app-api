import { DeleteResult } from 'mongodb'

import { DocumentIdArray } from 'database/interface/document'
import {
  IRequestDocument,
  IRequestDocumentArray,
} from 'database/models/request'
import { GetAllRequestsQuery } from 'modules/request/dto'
import { IRequestRepository } from 'modules/request/repository'

import UpdateRequestDto from '../dto/updateRequest.dto'

export interface IGetAllRequestsFilter extends GetAllRequestsQuery {}

export interface ICreateOneRequestPayload
  extends Pick<IRequestDocument, 'entityName'> {
  entity: string
  creator: string
}

export interface IUpdateOneRequestPayload extends UpdateRequestDto {}

export interface IDeleteManyRequestFilter
  extends Partial<{
    entityIds: DocumentIdArray
  }> {}

export interface IRequestService {
  getAll: (filter: IGetAllRequestsFilter) => Promise<IRequestDocumentArray>

  createOne: (payload: ICreateOneRequestPayload) => Promise<IRequestDocument>

  updateOneById: (
    id: IRequestDocument['id'],
    payload: IUpdateOneRequestPayload,
  ) => Promise<IRequestDocument>

  deleteOne: IRequestRepository['deleteOne']

  deleteOneWithEntity: (
    requestId: IRequestDocument['id'],
  ) => Promise<IRequestDocument>

  deleteMany: (filter: IDeleteManyRequestFilter) => Promise<DeleteResult>
}
