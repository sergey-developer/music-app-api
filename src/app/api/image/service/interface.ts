import { IImageRepository } from 'api/image/repository'

export interface IImageService {
  createOne: IImageRepository['createOne']

  deleteOneById: IImageRepository['deleteOneById']
}
