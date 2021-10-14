import { DocumentId } from 'database/interface/document'
import {
  CreateAlbumDto,
  GetAllAlbumsQuery,
  UpdateAlbumDto,
} from 'modules/album/dto'
import { IAlbumDocumentArray } from 'modules/album/interface'
import { IAlbumDocument } from 'modules/album/model'
import { IAlbumRepository } from 'modules/album/repository'

export interface IGetAllAlbumsServiceFilter extends GetAllAlbumsQuery {}

export interface ICreateAlbumServicePayload extends CreateAlbumDto {
  userId: DocumentId
}

export interface IUpdateAlbumServicePayload extends UpdateAlbumDto {}

export interface IUpdateAlbumServiceFilter
  extends Partial<{
    id: DocumentId
  }> {}

export interface IDeleteManyAlbumsServiceFilter
  extends Partial<{
    albums: IAlbumDocumentArray
  }> {}

export interface IAlbumService {
  getAll: (filter: IGetAllAlbumsServiceFilter) => Promise<IAlbumDocumentArray>

  create: (payload: ICreateAlbumServicePayload) => Promise<IAlbumDocument>

  update: (
    filter: IUpdateAlbumServiceFilter,
    payload: IUpdateAlbumServicePayload,
  ) => Promise<void>

  getOneById: IAlbumRepository['findOneById']

  deleteOneById: IAlbumRepository['deleteOneById']

  deleteMany: (filter: IDeleteManyAlbumsServiceFilter) => Promise<void>
}
