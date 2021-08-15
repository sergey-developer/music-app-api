import { CreateImageDto, CreateImageResultDto } from 'api/image/dto'

export interface IImageService {
  createOne: (payload: CreateImageDto) => Promise<CreateImageResultDto>
  deleteOneById: (id: string) => Promise<void>
}
