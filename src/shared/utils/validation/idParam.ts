import { Expose } from 'class-transformer'
import { IsMongoId } from 'class-validator'

export class IdParam {
  @Expose()
  @IsMongoId()
  id!: string
}
