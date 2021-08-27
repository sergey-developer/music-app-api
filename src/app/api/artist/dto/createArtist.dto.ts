import { Expose } from 'class-transformer'
import { IsMongoId, IsOptional, IsString, Length } from 'class-validator'

import { stringMessages } from 'shared/constants/validation'

class CreateArtistDto {
  @Expose()
  @IsString({
    message: stringMessages.isString,
  })
  @Length(3, 100, {
    message: stringMessages.length,
  })
  name!: string

  @Expose()
  @IsOptional()
  @IsMongoId()
  photo?: string

  @Expose()
  @IsOptional()
  @IsString({
    message: stringMessages.isString,
  })
  @Length(3, 1000, {
    message: stringMessages.length,
  })
  info?: string
}

export default CreateArtistDto
