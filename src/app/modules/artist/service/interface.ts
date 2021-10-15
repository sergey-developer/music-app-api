import { DocumentId } from 'database/interface/document'
import { CreateArtistDto, GetAllArtistsQuery } from 'modules/artist/dto'
import { IArtistDocumentArray } from 'modules/artist/interface'
import { IArtistDocument } from 'modules/artist/model'
import { IArtistRepository } from 'modules/artist/repository'

export interface IGetAllArtistsServiceFilter extends GetAllArtistsQuery {}

export interface ICreateArtistServicePayload extends CreateArtistDto {
  userId: DocumentId
}

export interface IArtistService {
  getAll: (filter: IGetAllArtistsServiceFilter) => Promise<IArtistDocumentArray>

  getOneById: (id: DocumentId) => Promise<IArtistDocument>

  create: (payload: ICreateArtistServicePayload) => Promise<IArtistDocument>

  deleteOneById: IArtistRepository['deleteOneById']
}
