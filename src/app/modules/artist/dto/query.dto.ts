import { IsEnum, IsMongoId, IsOptional } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import { IRequestDocument } from 'database/models/request'
import messages from 'lib/class-validator/messages'
import { RequestStatusEnum } from 'modules/request/constants'

export class GetAllArtistsQuery {
  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: IRequestDocument['status']

  @IsOptional()
  @IsMongoId({
    message: messages.mongoId,
  })
  userId?: DocumentId
}
