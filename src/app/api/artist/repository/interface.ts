import { CreateArtistDto } from 'api/artist/dto'
import { IArtistDocumentArray } from 'api/artist/interface'
import { IArtistDocument } from 'api/artist/model'
import { DocumentId } from 'database/interface/document'

export interface IFindAllArtistsRepositoryFilter
  extends Partial<{
    ids: Array<DocumentId<IArtistDocument>>
  }> {}

export interface ICreateArtistRepositoryPayload extends CreateArtistDto {}

export interface IArtistRepository {
  findAll: () => Promise<IArtistDocumentArray>

  findAllWhere: (
    filter: IFindAllArtistsRepositoryFilter,
  ) => Promise<IArtistDocumentArray>

  createOne: (
    payload: ICreateArtistRepositoryPayload,
  ) => Promise<IArtistDocument>

  deleteOneById: (id: DocumentId<IArtistDocument>) => Promise<IArtistDocument>
}
