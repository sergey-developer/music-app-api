import { IsMongoId, IsOptional, IsString, IsUrl, Length } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import { isString, lengthRange } from 'lib/class-validator/messages'

class CreateTrackDto {
  @IsString({
    message: isString,
  })
  @Length(3, 100, {
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
