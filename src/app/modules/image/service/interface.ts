import { CreateImageDto, UpdateImageDto } from 'modules/image/dto'
import { IImageDocument } from 'modules/image/model'
import { IImageRepository } from 'modules/image/repository'

export interface ICreateImagePayload extends CreateImageDto {}

export interface IUpdateImagePayload extends UpdateImageDto {}

export interface IImageService {
  getOneById: (id: IImageDocument['id']) => Promise<IImageDocument>

  createOne: (payload: ICreateImagePayload) => Promise<IImageDocument>

  updateByName: (
    fileName: IImageDocument['fileName'],
    payload: IUpdateImagePayload,
  ) => Promise<IImageDocument>

  deleteByName: (
    fileName: IImageDocument['fileName'],
  ) => Promise<IImageDocument>

  deleteMany: IImageRepository['deleteMany']
}
