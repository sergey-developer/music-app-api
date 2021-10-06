import { IsEnum, IsMongoId, IsOptional } from 'class-validator'

import { RequestStatusEnum } from 'api/request/constants'
import { ModelNamesEnum } from 'database/constants'

export class GetAllRequestsQuery {
  @IsOptional()
  @IsEnum(ModelNamesEnum)
  kind?: ModelNamesEnum

  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum

  @IsOptional()
  @IsMongoId({
    message: 'Not correct query value of "$property" was provided: "$value"',
  })
  creator?: string
}
