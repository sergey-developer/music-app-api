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
import { IAlbumDocument } from 'modules/album/model'

class CreateAlbumDto {
  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_ALBUM_NAME, MAX_LENGTH_ALBUM_NAME, {
    message: messages.lengthRange,
  })
  name!: IAlbumDocument['name']

  @IsDateString()
  releaseDate!: IAlbumDocument['releaseDate']

  @IsMongoId({
    message: messages.mongoId,
  })
  artist!: DocumentId

  @IsOptional()
  @IsMongoId({
    message: messages.mongoId,
  })
  image?: DocumentId
}

export default CreateAlbumDto
