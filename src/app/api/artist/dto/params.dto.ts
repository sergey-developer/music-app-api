import { IsMongoId } from 'class-validator'

export class GetOneArtistByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: string
}

export class DeleteOneArtistByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: string
}
