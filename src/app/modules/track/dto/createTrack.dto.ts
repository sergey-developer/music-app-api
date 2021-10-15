import { IsMongoId, IsOptional, IsString, IsUrl, Length } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import messages from 'lib/class-validator/messages'
import {
  MAX_LENGTH_TRACK_NAME,
  MIN_LENGTH_TRACK_NAME,
} from 'modules/track/constants'

class CreateTrackDto {
  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_TRACK_NAME, MAX_LENGTH_TRACK_NAME, {
    message: messages.lengthRange,
  })
  name!: string

  // TODO: валидировать по регулярке
  @IsString({
    message: messages.string,
  })
  duration!: string

  @IsOptional()
  @IsUrl()
  youtube?: string

  @IsMongoId({
    message: messages.mongoId,
  })
  album!: DocumentId
}

export default CreateTrackDto
