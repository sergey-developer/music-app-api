import { DocumentIdArray } from 'database/interface/document'
import { CreateArtistDto, UpdateArtistDto } from 'modules/artist/dto'
import { IArtistDocumentArray } from 'modules/artist/interface'
import { IArtistDocument } from 'modules/artist/model'

export interface IFindAllArtistsFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface ICreateArtistPayload extends CreateArtistDto {
  photo?: IArtistDocument['photo']
}

export interface IUpdateArtistPayload extends UpdateArtistDto {
  photo: IArtistDocument['photo']
}

export interface IUpdateArtistFilter
  extends Partial<{
    id: IArtistDocument['id']
  }> {}

export interface IArtistRepository {
  findAllWhere: (filter: IFindAllArtistsFilter) => Promise<IArtistDocumentArray>

  findOneById: (id: IArtistDocument['id']) => Promise<IArtistDocument>

  createOne: (payload: ICreateArtistPayload) => Promise<IArtistDocument>

  updateOne: (
    filter: IUpdateArtistFilter,
    payload: IUpdateArtistPayload,
  ) => Promise<IArtistDocument>

  deleteOneById: (id: IArtistDocument['id']) => Promise<IArtistDocument>
}
