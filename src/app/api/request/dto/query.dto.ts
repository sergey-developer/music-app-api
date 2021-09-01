import { Expose } from 'class-transformer'
import { IsEnum, IsMongoId, IsOptional } from 'class-validator'

import { RequestEntityNameEnum, RequestStatusEnum } from 'api/request/interface'

export class GetAllRequestsQuery {
  @Expose()
  @IsOptional()
  @IsEnum(RequestEntityNameEnum)
  kind?: RequestEntityNameEnum

  @Expose()
  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum

  @Expose()
  @IsOptional()
  @IsMongoId()
  creator?: string
}
