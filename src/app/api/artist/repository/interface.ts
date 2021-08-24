import { CreateArtistDto } from 'api/artist/dto'
import { ArtistDocumentArray } from 'api/artist/interface'
import { IArtistDocument } from 'api/artist/model'

export interface IArtistRepository {
  findAll: () => Promise<ArtistDocumentArray>
  createOne: (payload: CreateArtistDto) => Promise<IArtistDocument>
}
