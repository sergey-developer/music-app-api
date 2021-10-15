import { IsMongoId } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import messages from 'lib/class-validator/messages'

class CreateTrackHistoryDto {
  @IsMongoId({
    message: messages.mongoId,
  })
  track!: DocumentId
}

export default CreateTrackHistoryDto
