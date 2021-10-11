import { IsMongoId } from 'class-validator'

import { DocumentId } from 'database/interface/document'

class CreateTrackHistoryDto {
  @IsMongoId()
  track!: DocumentId
}

export default CreateTrackHistoryDto
