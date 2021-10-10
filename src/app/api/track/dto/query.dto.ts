import { IsEnum, IsMongoId, IsOptional } from 'class-validator'

import { RequestStatusEnum } from 'api/request/constants'
import { DocumentId } from 'database/interface/document'

export class GetAllTracksQuery {
  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum

  @IsOptional()
  @IsMongoId({
    message: 'Not correct query value of "$property" was provided: "$value"',
  })
  userId?: DocumentId

  @IsOptional()
  @IsMongoId({
    message: 'Not correct query value of "$property" was provided: "$value"',
  })
  artist?: DocumentId

  @IsOptional()
  @IsMongoId({
    message: 'Not correct query value of "$property" was provided: "$value"',
  })
  album?: DocumentId
}
