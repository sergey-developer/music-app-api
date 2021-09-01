import { Expose } from 'class-transformer'
import { IsMongoId, IsOptional } from 'class-validator'

export class GetAllTracksQuery {
  @Expose()
  @IsOptional()
  @IsMongoId()
  artist?: string

  @Expose()
  @IsOptional()
  @IsMongoId()
  album?: string
}
