import { Expose } from 'class-transformer'
import { IsDate, IsMongoId } from 'class-validator'

class CreateTrackHistoryDto {
  @Expose()
  @IsDate()
  listenDate!: Date

  @Expose()
  @IsMongoId()
  track!: string
}

export default CreateTrackHistoryDto
