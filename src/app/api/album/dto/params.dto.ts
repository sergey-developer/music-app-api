import { Expose } from 'class-transformer'
import { IsMongoId } from 'class-validator'

export class GetOneByIdParams {
  @Expose()
  @IsMongoId()
  id?: string
}
