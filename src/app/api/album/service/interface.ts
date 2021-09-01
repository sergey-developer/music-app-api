import { CreateAlbumDto, GetAllAlbumsQuery } from 'api/album/dto'
import { AlbumDocumentArray } from 'api/album/interface'
import { IAlbumDocument } from 'api/album/model'
import { IAlbumRepository } from 'api/album/repository'
import { IUserDocument } from 'api/user/model'
import { DocumentId } from 'database/interface/document'

export interface IGetAllAlbumsServiceFilter extends GetAllAlbumsQuery {}

export interface ICreateAlbumServicePayload extends CreateAlbumDto {
  userId: DocumentId<IUserDocument>
}

export interface IAlbumService {
  getAll: (filter: IGetAllAlbumsServiceFilter) => Promise<AlbumDocumentArray>

  createOne: (payload: ICreateAlbumServicePayload) => Promise<IAlbumDocument>

  getOneById: IAlbumRepository['findOneById']
}
