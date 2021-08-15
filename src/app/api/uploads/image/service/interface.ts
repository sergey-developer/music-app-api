import { IImageRepository } from 'api/uploads/image/repository'

export interface IImageService {
  createOne: (payload: any) => ReturnType<IImageRepository['createOne']>
}
