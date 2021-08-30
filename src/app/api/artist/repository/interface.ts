import { CreateArtistDto } from 'api/artist/dto'
import { ArtistDocumentArray } from 'api/artist/interface'
import { IArtistDocument } from 'api/artist/model'
import { DocumentId } from 'database/interface/document'

type GetAllArtistsRepositoryFilter = Partial<{
  ids: Array<DocumentId<IArtistDocument>>
}>

export interface IArtistRepository {
  findAll: () => Promise<ArtistDocumentArray>
  findAllWhere: (
    filter: GetAllArtistsRepositoryFilter,
  ) => Promise<ArtistDocumentArray>
  createOne: (payload: CreateArtistDto) => Promise<IArtistDocument>
  deleteOneById: (id: DocumentId<IArtistDocument>) => Promise<void>
}
