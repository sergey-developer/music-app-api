import { Expose } from 'class-transformer'
import { IsMongoId } from 'class-validator'

export class DeleteOneImageByIdParams {
  @Expose()
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: string
}
