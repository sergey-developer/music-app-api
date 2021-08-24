import { CreateImageDto, CreateImageResultDto } from 'api/image/dto'
import { IImageRepository } from 'api/image/repository'

export interface IImageService {
  createOne: (payload: CreateImageDto) => Promise<CreateImageResultDto>
  deleteOneById: IImageRepository['deleteOneById']
}
