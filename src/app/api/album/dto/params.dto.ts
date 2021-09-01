import { Expose } from 'class-transformer'
import { IsMongoId } from 'class-validator'

export class GetOneAlbumByIdParams {
  @Expose()
  @IsMongoId({
    message: 'Not correct value of "$property" was provided: "$value"',
  })
  id!: string
}
