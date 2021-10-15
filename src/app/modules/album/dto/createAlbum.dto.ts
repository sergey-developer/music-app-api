import {
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

import { DocumentId } from 'database/interface/document'
import messages from 'lib/class-validator/messages'
import {
  MAX_LENGTH_ALBUM_NAME,
  MIN_LENGTH_ALBUM_NAME,
} from 'modules/album/constants'

class CreateAlbumDto {
  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_ALBUM_NAME, MAX_LENGTH_ALBUM_NAME, {
    message: messages.lengthRange,
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
