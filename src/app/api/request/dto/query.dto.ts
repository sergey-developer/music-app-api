import { IsEnum, IsMongoId, IsOptional } from 'class-validator'

import { RequestEntityNameEnum, RequestStatusEnum } from 'api/request/constants'

export class GetAllRequestsQuery {
  @IsOptional()
  @IsEnum(RequestEntityNameEnum)
  kind?: RequestEntityNameEnum

  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum

  @IsOptional()
  @IsMongoId({
    message: 'Not correct query value of "$property" was provided: "$value"',
  })
  creator?: string
}
