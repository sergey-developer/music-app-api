import { IImageModel } from 'api/uploads/image/model'

export interface IImageRepository {
  createOne: (payload: any) => Promise<IImageModel>
}
