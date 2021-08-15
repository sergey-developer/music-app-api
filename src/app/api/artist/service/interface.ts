import { CreateArtistDto, CreateArtistResultDto } from 'api/artist/dto'
import { IArtistRepository } from 'api/artist/repository'

export interface IArtistService {
  getAll: () => ReturnType<IArtistRepository['findAll']>
  createOne: (payload: CreateArtistDto) => Promise<CreateArtistResultDto>
}
