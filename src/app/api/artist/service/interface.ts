import { CreateArtistDto } from 'api/artist/dto'
import { IArtistRepository } from 'api/artist/repository'

export interface IArtistService {
  getAll: () => ReturnType<IArtistRepository['findAll']>

  createOne: (
    payload: CreateArtistDto,
  ) => ReturnType<IArtistRepository['createOne']>
}
