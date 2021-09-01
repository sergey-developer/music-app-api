import { Expose } from 'class-transformer'
import { IsMongoId } from 'class-validator'

class CreateTrackHistoryDto {
  @Expose()
  @IsMongoId()
  track!: string
}

export default CreateTrackHistoryDto
