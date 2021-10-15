import { IsMongoId, IsOptional, IsString, Length } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import messages from 'lib/class-validator/messages'
import {
  MAX_LENGTH_ARTIST_INFO,
  MAX_LENGTH_ARTIST_NAME,
  MIN_LENGTH_ARTIST_INFO,
  MIN_LENGTH_ARTIST_NAME,
} from 'modules/artist/constants'

class UpdateArtistDto {
  @IsOptional()
  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_ARTIST_NAME, MAX_LENGTH_ARTIST_NAME, {
    message: messages.lengthRange,
  })
  name?: string

  @IsOptional()
  @IsMongoId({
    message: messages.mongoId,
  })
  photo?: DocumentId

  @IsOptional()
  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_ARTIST_INFO, MAX_LENGTH_ARTIST_INFO, {
    message: messages.lengthRange,
  })
  info?: string
}

export default UpdateArtistDto
