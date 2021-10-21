import { CreateImageDto, UpdateImageDto } from 'modules/image/dto'
import { IImageDocument } from 'modules/image/model'
import { IImageRepository } from 'modules/image/repository'

export interface ICreateImagePayload extends CreateImageDto {}

export interface IUpdateImagePayload extends Omit<UpdateImageDto, 'fileName'> {}

export interface IUpdateImageFilter {
  id: IImageDocument['id']
  fileName: IImageDocument['fileName']
}

export interface IImageService {
  getOneById: (id: IImageDocument['id']) => Promise<IImageDocument>

  createOne: (payload: ICreateImagePayload) => Promise<IImageDocument>

  updateOne: (
    filter: IUpdateImageFilter,
    payload: IUpdateImagePayload,
  ) => Promise<IImageDocument>

  deleteOneById: (id: IImageDocument['id']) => Promise<IImageDocument>

  deleteMany: IImageRepository['deleteMany']
}
