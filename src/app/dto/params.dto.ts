import { IsMongoId } from 'class-validator'

import { DocumentId } from 'database/interface/document'
import messages from 'lib/class-validator/messages'

export class IdParam {
  @IsMongoId({
    message: messages.mongoId,
  })
  id!: DocumentId
}
