import { IsEnum, IsOptional, IsString, Length } from 'class-validator'

import messages from 'lib/class-validator/messages'
import { IRequestDocument } from 'modules/../../../../database/models/request/model'
import {
  MAX_LENGTH_REASON,
  MIN_LENGTH_REASON,
  RequestStatusEnum,
} from 'modules/request/constants'

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
