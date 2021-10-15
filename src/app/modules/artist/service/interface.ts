import { DocumentId } from 'database/interface/document'
import {
  CreateArtistDto,
  GetAllArtistsQuery,
  UpdateArtistDto,
} from 'modules/artist/dto'
import { IArtistDocumentArray } from 'modules/artist/interface'
import { IArtistDocument } from 'modules/artist/model'
import { IArtistRepository } from 'modules/artist/repository'

export interface IGetAllArtistsFilter extends GetAllArtistsQuery {}

export interface ICreateArtistPayload extends CreateArtistDto {
  userId: DocumentId
}

export interface IUpdateArtistPayload extends UpdateArtistDto {}

export interface IArtistService {
  getAll: (filter: IGetAllArtistsFilter) => Promise<IArtistDocumentArray>

  getOneById: (id: DocumentId) => Promise<IArtistDocument>

  create: (payload: ICreateArtistPayload) => Promise<IArtistDocument>

  updateById: (id: DocumentId, payload: IUpdateArtistPayload) => Promise<void>

  deleteOneById: IArtistRepository['deleteOneById']
}
