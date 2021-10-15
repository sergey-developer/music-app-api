import { IsMongoId } from 'class-validator'

import { DocumentId } from 'database/interface/document'

export class DeleteRequestParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: DocumentId
}
