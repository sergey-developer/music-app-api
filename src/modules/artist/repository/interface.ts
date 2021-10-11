import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { CreateArtistDto } from 'modules/artist/dto'
import { IArtistDocumentArray } from 'modules/artist/interface'
import { IArtistDocument } from 'modules/artist/model'

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
