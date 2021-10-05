import { IsMongoId } from 'class-validator'

export class DeleteOneTrackHistoryByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: string
}
