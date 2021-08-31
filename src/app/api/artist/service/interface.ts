import { CreateArtistDto, GetAllArtistsFilterDto } from 'api/artist/dto'
import { ArtistDocumentArray } from 'api/artist/interface'
import { IArtistDocument } from 'api/artist/model'
import { IArtistRepository } from 'api/artist/repository'
import { IUserDocument } from 'api/user/model'
import { DocumentId } from 'database/interface/document'

export interface ICreateArtistServicePayload extends CreateArtistDto {
  userId: DocumentId<IUserDocument>
}

export interface IArtistService {
  getAll: (filter: GetAllArtistsFilterDto) => Promise<ArtistDocumentArray>
  createOne: (payload: ICreateArtistServicePayload) => Promise<IArtistDocument>
  deleteOneById: IArtistRepository['deleteOneById']
}
