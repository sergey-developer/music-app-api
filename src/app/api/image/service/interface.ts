import { CreateImageResultDto } from 'api/image/dto'
import { IImageRepository } from 'api/image/repository'
import { IMulterFile } from 'api/uploads/middlewares/upload'

export interface IImageService {
  createOne: (payload: IMulterFile) => Promise<CreateImageResultDto>
  deleteOneById: IImageRepository['deleteOneById']
}
