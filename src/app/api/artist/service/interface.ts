import { GetAllArtistsFilterDto } from 'api/artist/dto'
import { ArtistDocumentArray, ICreateArtistPayload } from 'api/artist/interface'
import { IArtistDocument } from 'api/artist/model'
import { IArtistRepository } from 'api/artist/repository'

export interface IArtistService {
  getAll: (filter: GetAllArtistsFilterDto) => Promise<ArtistDocumentArray>
  createOne: (payload: ICreateArtistPayload) => Promise<IArtistDocument>
  deleteOneById: IArtistRepository['deleteOneById']
}
