import { Expose } from 'class-transformer'
import { IsEnum, IsMongoId, IsOptional } from 'class-validator'

import { RequestStatusEnum } from 'api/request/interface'

export class GetAllArtistsQuery {
  @Expose()
  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum

  @Expose()
  @IsOptional()
  @IsMongoId()
  userId?: string
}
