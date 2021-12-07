import {
  IsInt,
  IsMongoId,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from 'class-validator'

import { DocumentId } from 'database/interface/document'
import {
  ITrackDocument,
  MAX_LENGTH_TRACK_NAME,
  MIN_LENGTH_TRACK_NAME,
} from 'database/models/track'
import messages from 'lib/class-validator/messages'

class UpdateTrackDto {
  @IsOptional()
  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_TRACK_NAME, MAX_LENGTH_TRACK_NAME, {
    message: messages.lengthRange,
  })
  name?: ITrackDocument['name']

  @IsOptional()
  @IsPositive()
  @IsInt()
  duration?: ITrackDocument['duration']

  @IsOptional()
  @IsUrl()
  youtube?: ITrackDocument['youtube']

  @IsOptional()
  @IsMongoId({
    message: messages.mongoId,
  })
  album?: DocumentId
}

export default UpdateTrackDto
