import {
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

import { DocumentId } from 'database/interface/document'
import { stringMessages } from 'shared/constants/validator'

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
  image?: DocumentId

  @IsMongoId()
  artist!: DocumentId
}

export default CreateAlbumDto
