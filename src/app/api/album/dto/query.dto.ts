import { IsMongoId, IsOptional } from 'class-validator'

export class GetAllAlbumsQuery {
  @IsOptional()
  @IsMongoId({
    message: 'Not correct query value of "$property" was provided: "$value"',
  })
  artist?: string
}
