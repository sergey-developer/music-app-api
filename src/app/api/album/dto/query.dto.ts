import { Expose } from 'class-transformer'
import { IsMongoId, IsOptional } from 'class-validator'

export class GetAllAlbumsQuery {
  @Expose()
  @IsOptional()
  @IsMongoId()
  artist?: string
}
