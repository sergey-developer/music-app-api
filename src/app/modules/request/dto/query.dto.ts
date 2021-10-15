import { IsEnum, IsMongoId, IsOptional } from 'class-validator'

import { ModelNamesEnum } from 'database/constants'
import { DocumentId } from 'database/interface/document'
import messages from 'lib/class-validator/messages'
import { RequestStatusEnum } from 'modules/request/constants'

export class GetAllRequestsQuery {
  @IsOptional()
  @IsEnum(ModelNamesEnum)
  kind?: ModelNamesEnum

  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum

  @IsOptional()
  @IsMongoId({
    message: messages.mongoId,
  })
  creator?: DocumentId
}
