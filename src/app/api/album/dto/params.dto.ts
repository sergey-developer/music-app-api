import { IsMongoId } from 'class-validator'

export class GetOneAlbumByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: string
}

export class DeleteOneAlbumByIdParams {
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: string
}
