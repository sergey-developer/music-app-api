import { IsEnum, IsMongoId, IsOptional } from 'class-validator'

import { EntityNamesEnum } from 'database/constants'
import { DocumentId } from 'database/interface/document'
import { IRequestDocument } from 'database/models/request'
import messages from 'lib/class-validator/messages'
import { RequestStatusEnum } from 'modules/request/constants'

export class GetAllRequestsQuery {
  @IsOptional()
  @IsEnum(EntityNamesEnum)
  kind?: IRequestDocument['entityName']

  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: IRequestDocument['status']

  @IsOptional()
  @IsMongoId({
    message: messages.mongoId,
  })
  creator?: DocumentId
}
