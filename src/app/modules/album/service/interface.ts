import { DocumentId } from 'database/interface/document'
import {
  CreateAlbumDto,
  GetAllAlbumsQuery,
  UpdateAlbumDto,
} from 'modules/album/dto'
import { IAlbumDocumentArray } from 'modules/album/interface'
import { IAlbumDocument } from 'modules/album/model'
import { IAlbumRepository } from 'modules/album/repository'

export interface IGetAllAlbumsFilter extends GetAllAlbumsQuery {}

export interface ICreateAlbumPayload extends CreateAlbumDto {
  userId: DocumentId
}

export interface IUpdateAlbumPayload extends UpdateAlbumDto {}

export interface IDeleteManyAlbumsFilter
  extends Partial<{
    albums: IAlbumDocumentArray
  }> {}

export interface IAlbumService {
  getAll: (filter: IGetAllAlbumsFilter) => Promise<IAlbumDocumentArray>

  getOneById: IAlbumRepository['findOneById']

  create: (payload: ICreateAlbumPayload) => Promise<IAlbumDocument>

  updateById: (id: DocumentId, payload: IUpdateAlbumPayload) => Promise<void>

  deleteOneById: IAlbumRepository['deleteOneById']

  deleteMany: (filter: IDeleteManyAlbumsFilter) => Promise<void>
}
