import { IsMongoId, IsOptional, IsString, Length } from 'class-validator'

import { stringMessages } from 'shared/constants/validation'

class CreateArtistDto {
  @IsString({
    message: stringMessages.isString,
  })
  @Length(3, 100, {
    message: stringMessages.length,
  })
  name!: string

  @IsOptional()
  @IsMongoId()
  photo?: string

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
