import { IsEnum, IsOptional, IsString, Length } from 'class-validator'

import {
  IRequestDocument,
  MAX_LENGTH_REASON,
  MIN_LENGTH_REASON,
} from 'database/models/request'
import messages from 'lib/class-validator/messages'
import { RequestStatusEnum } from 'modules/request/constants'

class UpdateRequestDto {
  @IsEnum(RequestStatusEnum)
  status!: IRequestDocument['status']

  @IsOptional()
  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_REASON, MAX_LENGTH_REASON, {
    message: messages.lengthRange,
  })
  reason?: IRequestDocument['reason']
}

export default UpdateRequestDto
