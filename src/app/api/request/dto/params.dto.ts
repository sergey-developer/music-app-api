import { IsMongoId } from 'class-validator'

export class DeleteOneRequestByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: string
}
