import { DocumentId } from 'database/interface/document'
import { IArtistDocument } from 'database/models/artist'
import {
  CreateArtistDto,
  GetAllArtistsQuery,
  UpdateArtistDto,
} from 'modules/artist/dto'
import { IArtistDocumentArray } from 'modules/artist/interface'

export interface IGetAllArtistsFilter extends GetAllArtistsQuery {}

export interface ICreateOneArtistPayload extends CreateArtistDto {
  user: DocumentId
  photo?: IArtistDocument['photo']
}

export interface IUpdateOneArtistPayload extends UpdateArtistDto {
  photo: IArtistDocument['photo']
}

export interface IArtistService {
  getAll: (filter: IGetAllArtistsFilter) => Promise<IArtistDocumentArray>

  getOneById: (id: IArtistDocument['id']) => Promise<IArtistDocument>

  createOne: (payload: ICreateOneArtistPayload) => Promise<IArtistDocument>

  updateOneById: (
    id: IArtistDocument['id'],
    payload: IUpdateOneArtistPayload,
  ) => Promise<IArtistDocument>

  deleteOneById: (id: IArtistDocument['id']) => Promise<IArtistDocument>
}
