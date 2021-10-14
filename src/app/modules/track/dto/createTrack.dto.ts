import { IsMongoId, IsOptional, IsString, IsUrl, Length } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import { isString, lengthRange } from 'lib/class-validator/messages'
import {
  MAX_LENGTH_TRACK_NAME,
  MIN_LENGTH_TRACK_NAME,
} from 'modules/track/constants'

class CreateTrackDto {
  @IsString({
    message: isString,
  })
  @Length(MIN_LENGTH_TRACK_NAME, MAX_LENGTH_TRACK_NAME, {
    message: lengthRange,
  })
  name!: string

  // TODO: валидировать по регулярке
  @IsString({
    message: isString,
  })
  duration!: string

  @IsOptional()
  @IsUrl()
  youtube?: string

  @IsMongoId()
  album!: DocumentId
}

export default CreateTrackDto
