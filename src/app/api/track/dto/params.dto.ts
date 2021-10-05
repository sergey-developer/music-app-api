import { IsMongoId } from 'class-validator'

export class DeleteOneTrackByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: string
}
