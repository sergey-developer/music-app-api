import { IsMongoId, IsOptional, IsString, Length } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import { isString, lengthRange } from 'lib/class-validator/messages'
import {
  MAX_LENGTH_ARTIST_INFO,
  MAX_LENGTH_ARTIST_NAME,
  MIN_LENGTH_ARTIST_INFO,
  MIN_LENGTH_ARTIST_NAME,
} from 'modules/artist/constants'

class CreateArtistDto {
  @IsString({
    message: isString,
  })
  @Length(MIN_LENGTH_ARTIST_NAME, MAX_LENGTH_ARTIST_NAME, {
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
  @Length(MIN_LENGTH_ARTIST_INFO, MAX_LENGTH_ARTIST_INFO, {
    message: lengthRange,
  })
  info?: string
}

export default CreateArtistDto
