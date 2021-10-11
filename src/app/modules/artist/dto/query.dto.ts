import { IsEnum, IsMongoId, IsOptional } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import { RequestStatusEnum } from 'modules/request/constants'

export class GetAllArtistsQuery {
  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum

  @IsOptional()
  @IsMongoId({
    message: 'Not correct query value of "$property" was provided: "$value"',
  })
  userId?: DocumentId
}
