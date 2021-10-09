import { IsMongoId } from 'class-validator'

import { DocumentId } from 'database/interface/document'

export class DeleteOneRequestByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: DocumentId
}
