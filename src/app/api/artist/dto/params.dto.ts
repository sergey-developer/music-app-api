import { IsMongoId } from 'class-validator'

import { DocumentId } from 'database/interface/document'

export class GetOneArtistByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: DocumentId
}

export class DeleteOneArtistByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: DocumentId
}
