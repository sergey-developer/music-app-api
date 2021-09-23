import { IsMongoId, IsOptional } from 'class-validator'

export class GetAllTracksQuery {
  @IsOptional()
  @IsMongoId({
    message: 'Not correct query value of "$property" was provided: "$value"',
  })
  artist?: string

  @IsOptional()
  @IsMongoId({
    message: 'Not correct query value of "$property" was provided: "$value"',
  })
  album?: string
}
