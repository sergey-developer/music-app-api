import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { CreateArtistDto, UpdateArtistDto } from 'modules/artist/dto'
import { IArtistDocumentArray } from 'modules/artist/interface'
import { IArtistDocument } from 'modules/artist/model'

export interface IFindAllArtistsFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface ICreateArtistPayload extends CreateArtistDto {}

export interface IUpdateArtistPayload extends UpdateArtistDto {}
export interface IUpdateArtistFilter
  extends Partial<{
    id: DocumentId
  }> {}

export interface IArtistRepository {
  findAllWhere: (filter: IFindAllArtistsFilter) => Promise<IArtistDocumentArray>

  findOneById: (id: DocumentId) => Promise<IArtistDocument>

  create: (payload: ICreateArtistPayload) => Promise<IArtistDocument>

  update: (
    filter: IUpdateArtistFilter,
    payload: IUpdateArtistPayload,
  ) => Promise<void>

  deleteOneById: (id: DocumentId) => Promise<IArtistDocument>
}
