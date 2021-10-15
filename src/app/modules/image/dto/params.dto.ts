import { IsMongoId } from 'class-validator'

import { DocumentId } from 'database/interface/document'

export class DeleteImageParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: DocumentId
}
