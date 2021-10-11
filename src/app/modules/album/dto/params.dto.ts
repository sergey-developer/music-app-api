import { IsMongoId } from 'class-validator'

import { DocumentId } from 'database/interface/document'

export class GetOneAlbumByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: DocumentId
}

export class DeleteOneAlbumByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: DocumentId
}
