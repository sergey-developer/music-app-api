import { IsDateString, IsMongoId, IsString, Length } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import { IAlbumDocument } from 'database/models/album'
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
  name!: IAlbumDocument['name']

  @IsDateString()
  releaseDate!: IAlbumDocument['releaseDate']

  @IsMongoId({
    message: messages.mongoId,
  })
  artist!: DocumentId
}

export default CreateAlbumDto
