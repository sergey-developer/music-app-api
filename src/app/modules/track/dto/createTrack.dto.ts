import { Type } from 'class-transformer'
import {
  IsInt,
  IsMongoId,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Max,
} from 'class-validator'

import { DocumentId } from 'database/interface/document'
import {
  ITrackDocument,
  MAX_LENGTH_TRACK_NAME,
  MIN_LENGTH_TRACK_NAME,
} from 'database/models/track'
import messages from 'lib/class-validator/messages'

class TrackDurationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(59)
  minutes?: number

  @IsInt()
  @IsPositive()
  @Max(59)
  seconds!: number
}

class CreateTrackDto {
  @IsString({
    message: messages.string,
  })
  @Length(MIN_LENGTH_TRACK_NAME, MAX_LENGTH_TRACK_NAME, {
    message: messages.lengthRange,
  })
  name!: ITrackDocument['name']

  @Type(() => TrackDurationDto)
  duration!: TrackDurationDto

  @IsOptional()
  @IsUrl()
  youtube?: ITrackDocument['youtube']

  @IsMongoId({
    message: messages.mongoId,
  })
  album!: DocumentId
}

export default CreateTrackDto
