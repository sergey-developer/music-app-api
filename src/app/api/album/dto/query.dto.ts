import { IsMongoId, IsOptional } from 'class-validator'

import { DocumentId } from 'database/interface/document'

export class GetAllAlbumsQuery {
  @IsOptional()
  @IsMongoId({
    message: 'Not correct query value of "$property" was provided: "$value"',
  })
  artist?: DocumentId
}
