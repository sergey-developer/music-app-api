import { Expose } from 'class-transformer'
import {
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

import { stringMessages } from 'shared/constants/validation'

class CreateAlbumDto {
  @Expose()
  @IsString({
    message: stringMessages.isString,
  })
  @Length(3, 100, {
    message: stringMessages.length,
  })
  name!: string

  @Expose()
  @IsDateString()
  releaseDate!: string

  @Expose()
  @IsOptional()
  @IsMongoId()
  image?: string

  @Expose()
  @IsMongoId()
  artist!: string
}

export default CreateAlbumDto
