import { IsOptional, IsString, Length } from 'class-validator'

import {
  IArtistDocument,
  MAX_LENGTH_ARTIST_INFO,
  MAX_LENGTH_ARTIST_NAME,
  MIN_LENGTH_ARTIST_INFO,
  MIN_LENGTH_ARTIST_NAME,
} from 'database/models/artist'
import messages from 'lib/class-validator/messages'

class UpdateArtistDto {
  @IsOptional()
  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_ARTIST_NAME, MAX_LENGTH_ARTIST_NAME, {
    message: messages.lengthRange,
  })
  name?: IArtistDocument['name']

  @IsOptional()
  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_ARTIST_INFO, MAX_LENGTH_ARTIST_INFO, {
    message: messages.lengthRange,
  })
  info?: IArtistDocument['info']
}

export default UpdateArtistDto
