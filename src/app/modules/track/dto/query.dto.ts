import { IsEnum, IsMongoId, IsOptional } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import messages from 'lib/class-validator/messages'
import { RequestStatusEnum } from 'modules/request/constants'

export class GetAllTracksQuery {
  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum

  @IsOptional()
  @IsMongoId({
    message: messages.mongoId,
  })
  userId?: DocumentId

  @IsOptional()
  @IsMongoId({
    message: messages.mongoId,
  })
  artist?: DocumentId

  @IsOptional()
  @IsMongoId({
    message: messages.mongoId,
  })
  album?: DocumentId
}
