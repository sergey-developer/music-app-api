import { IsMongoId, IsOptional } from 'class-validator'

import { DocumentId } from 'database/interface/document'

export class GetAllTracksQuery {
  @IsOptional()
  @IsMongoId({
    message: 'Not correct query value of "$property" was provided: "$value"',
  })
  artist?: DocumentId

  @IsOptional()
  @IsMongoId({
    message: 'Not correct query value of "$property" was provided: "$value"',
  })
  album?: DocumentId
}
