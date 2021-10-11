import { IsMongoId, IsOptional, IsString, IsUrl, Length } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import { stringMessages } from 'shared/constants/validator'

class CreateTrackDto {
  @IsString({
    message: stringMessages.isString,
  })
  @Length(3, 100, {
    message: stringMessages.length,
  })
  name!: string

  // TODO: валидировать по регулярке
  @IsString({
    message: stringMessages.isString,
  })
  duration!: string

  @IsOptional()
  @IsUrl()
  youtube?: string

  @IsMongoId()
  album!: DocumentId
}

export default CreateTrackDto
