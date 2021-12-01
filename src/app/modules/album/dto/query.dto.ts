import { IsEnum, IsMongoId, IsOptional } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import { IRequestDocument } from 'database/models/request'
import messages from 'lib/class-validator/messages'
import { RequestStatusEnum } from 'modules/request/constants'

export class GetAllAlbumsQuery {
  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: IRequestDocument['status']

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
}
