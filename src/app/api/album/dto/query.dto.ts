import { Expose } from 'class-transformer'
import { IsMongoId, IsOptional } from 'class-validator'

export class GetAllQuery {
  @Expose()
  @IsOptional()
  @IsMongoId()
  artist?: string
}
