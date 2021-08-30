import { CreateArtistDto } from 'api/artist/dto'
import { IUserDocument } from 'api/user/model'
import { DocumentId } from 'database/interface/document'

export interface ICreateArtistPayload extends CreateArtistDto {
  userId: DocumentId<IUserDocument>
}
