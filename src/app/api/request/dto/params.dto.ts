import { Expose } from 'class-transformer'
import { IsMongoId } from 'class-validator'

export class DeleteOneRequestByIdParams {
  @Expose()
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: string
}
