import {
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

import { DocumentId } from 'database/interface/document'
import { isString, lengthRange } from 'lib/class-validator/messages'
import {
  MAX_LENGTH_ALBUM_NAME,
  MIN_LENGTH_ALBUM_NAME,
} from 'modules/album/constants'

class UpdateAlbumDto {
  @IsOptional()
  @IsString({
    message: isString,
  })
  @Length(MIN_LENGTH_ALBUM_NAME, MAX_LENGTH_ALBUM_NAME, {
    message: lengthRange,
  })
  name?: string

  @IsOptional()
  @IsDateString()
  releaseDate?: string

  @IsOptional()
  @IsMongoId()
  image?: DocumentId

  @IsOptional()
  @IsMongoId()
  artist?: DocumentId
}

export default UpdateAlbumDto
