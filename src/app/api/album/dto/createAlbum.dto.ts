import {
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

import { stringMessages } from 'shared/constants/validation'

class CreateAlbumDto {
  @IsString({
    message: stringMessages.isString,
  })
  @Length(3, 100, {
    message: stringMessages.length,
  })
  name!: string

  @IsDateString()
  releaseDate!: string

  @IsOptional()
  @IsMongoId()
  image?: string

  @IsMongoId()
  artist!: string
}

export default CreateAlbumDto
