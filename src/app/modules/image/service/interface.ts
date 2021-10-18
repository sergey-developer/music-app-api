import { DocumentId } from 'database/interface/document'
import { CreateImageDto, UpdateImageDto } from 'modules/image/dto'
import { IImageDocument } from 'modules/image/model'
import { IImageRepository } from 'modules/image/repository'

export interface ICreateImagePayload extends CreateImageDto {}

export interface IUpdateImagePayload extends UpdateImageDto {}

export interface IImageService {
  getOneById: (id: DocumentId) => Promise<IImageDocument>

  createOne: (payload: ICreateImagePayload) => Promise<IImageDocument>

  updateById: (
    id: DocumentId,
    payload: IUpdateImagePayload,
  ) => Promise<IImageDocument>

  deleteOneById: (id: DocumentId) => Promise<IImageDocument>

  deleteMany: IImageRepository['deleteMany']
}
