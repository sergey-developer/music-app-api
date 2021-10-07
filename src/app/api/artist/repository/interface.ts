import { CreateArtistDto } from 'api/artist/dto'
import { IArtistDocumentArray } from 'api/artist/interface'
import { IArtistDocument } from 'api/artist/model'
import { DocumentId, DocumentIdArray } from 'database/interface/document'

export interface IFindAllArtistsRepositoryFilter
  extends Partial<{
    ids: DocumentIdArray
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

  deleteOneById: (id: DocumentId) => Promise<IArtistDocument>
}
