import { IsMongoId } from 'class-validator'

import { DocumentId } from 'database/interface/document'

export class GetArtistParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: DocumentId
}

export class DeleteArtistParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: DocumentId
}
