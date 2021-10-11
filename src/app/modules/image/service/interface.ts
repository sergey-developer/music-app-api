import { IImageRepository } from 'modules/image/repository'

export interface IImageService {
  createOne: IImageRepository['createOne']

  deleteOneById: IImageRepository['deleteOneById']

  deleteMany: IImageRepository['deleteMany']
}
