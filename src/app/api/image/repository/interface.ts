import { CreateImageDto } from 'api/image/dto'
import { IImageModel } from 'api/image/model'

export interface IImageRepository {
  createOne: (payload: CreateImageDto) => Promise<IImageModel>
  deleteOneById: (id: string) => Promise<void>
}
