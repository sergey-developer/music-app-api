import { IsMongoId } from 'class-validator'

export class DeleteOneImageByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: string
}
