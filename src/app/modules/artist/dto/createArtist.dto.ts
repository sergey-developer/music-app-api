import { IsMongoId, IsOptional, IsString, Length } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import { isString, lengthRange } from 'lib/class-validator/messages'

class CreateArtistDto {
  @IsString({
    message: isString,
  })
  @Length(3, 100, {
    message: lengthRange,
  })
  name!: string

  @IsOptional()
  @IsMongoId()
  photo?: DocumentId

  @IsOptional()
  @IsString({
    message: isString,
  })
  @Length(3, 1000, {
    message: lengthRange,
  })
  info?: string
}

export default CreateArtistDto
