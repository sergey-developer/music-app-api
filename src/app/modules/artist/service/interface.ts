import { DocumentId } from 'database/interface/document'
import {
  CreateArtistDto,
  GetAllArtistsQuery,
  UpdateArtistDto,
} from 'modules/artist/dto'
import { IArtistDocumentArray } from 'modules/artist/interface'
import { IArtistDocument } from 'modules/artist/model'

export interface IGetAllArtistsFilter extends GetAllArtistsQuery {}

export interface ICreateArtistPayload extends CreateArtistDto {
  userId: DocumentId
  photo?: IArtistDocument['photo']
}

export interface IUpdateArtistPayload extends UpdateArtistDto {
  photo: IArtistDocument['photo']
}

export interface IArtistService {
  getAll: (filter: IGetAllArtistsFilter) => Promise<IArtistDocumentArray>

  getOneById: (id: IArtistDocument['id']) => Promise<IArtistDocument>

  createOne: (payload: ICreateArtistPayload) => Promise<IArtistDocument>

  updateOneById: (
    id: IArtistDocument['id'],
    payload: IUpdateArtistPayload,
  ) => Promise<IArtistDocument>

  deleteOneById: (id: IArtistDocument['id']) => Promise<IArtistDocument>
}
