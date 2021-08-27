import { Expose } from 'class-transformer'
import {
  IsDate,
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
  @IsDate()
  releaseDate!: Date

  @Expose()
  @IsOptional()
  @IsMongoId()
  image?: string

  @Expose()
  @IsMongoId()
  artist!: string
}

export default CreateAlbumDto
