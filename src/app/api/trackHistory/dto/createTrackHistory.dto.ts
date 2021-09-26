import { IsMongoId } from 'class-validator'

class CreateTrackHistoryDto {
  @IsMongoId()
  track!: string
}

export default CreateTrackHistoryDto
