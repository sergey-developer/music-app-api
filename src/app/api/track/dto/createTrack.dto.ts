import { Expose } from 'class-transformer'
import { IsMongoId, IsOptional, IsString, IsUrl, Length } from 'class-validator'

import { stringMessages } from 'shared/constants/validation'

class CreateTrackDto {
  @Expose()
  @IsString({
    message: stringMessages.isString,
  })
  @Length(3, 100, {
    message: stringMessages.length,
  })
  name!: string

  // TODO: валидировать по регулярке
  @Expose()
  @IsString({
    message: stringMessages.isString,
  })
  duration!: string

  @Expose()
  @IsOptional()
  @IsUrl()
  // TODO: validate url
  youtube?: string

  @Expose()
  @IsMongoId()
  album!: string
}

export default CreateTrackDto
