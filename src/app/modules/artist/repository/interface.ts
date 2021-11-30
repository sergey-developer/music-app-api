import { DocumentIdArray } from 'database/interface/document'
import { IArtistDocument } from 'database/models/artist'
import { CreateArtistDto, UpdateArtistDto } from 'modules/artist/dto'
import { IArtistDocumentArray } from 'modules/artist/interface'

export interface IFindAllArtistsFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface IFindOneArtistFilter
  extends Partial<{
    id: IArtistDocument['id']
  }> {}

export interface ICreateOneArtistPayload extends CreateArtistDto {
  photo?: IArtistDocument['photo']
}

export interface IUpdateOneArtistPayload extends UpdateArtistDto {
  photo: IArtistDocument['photo']
}

export interface IUpdateOneArtistFilter
  extends Partial<{
    id: IArtistDocument['id']
  }> {}

export interface IDeleteOneArtistFilter
  extends Partial<{
    id: IArtistDocument['id']
  }> {}

export interface IArtistRepository {
  findAllWhere: (filter: IFindAllArtistsFilter) => Promise<IArtistDocumentArray>

  findOne: (filter: IFindOneArtistFilter) => Promise<IArtistDocument>

  createOne: (payload: ICreateOneArtistPayload) => Promise<IArtistDocument>

  updateOne: (
    filter: IUpdateOneArtistFilter,
    payload: IUpdateOneArtistPayload,
  ) => Promise<IArtistDocument>

  deleteOne: (filter: IDeleteOneArtistFilter) => Promise<IArtistDocument>
}
