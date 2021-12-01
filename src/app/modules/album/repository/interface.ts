import { DeleteResult } from 'mongodb'

import { DocumentId, DocumentIdArray } from 'database/interface/document'
import { IAlbumDocument, IAlbumDocumentArray } from 'database/models/album'
import { CreateAlbumDto, UpdateAlbumDto } from 'modules/album/dto'

export interface IFindAllAlbumsFilter
  extends Partial<{
    ids: DocumentIdArray
    artist: DocumentId
  }> {}

export interface IFindOneAlbumFilter
  extends Partial<{
    id: IAlbumDocument['id']
  }> {}

export interface ICreateOneAlbumPayload extends CreateAlbumDto {
  image?: IAlbumDocument['image']
}

export interface IUpdateOneAlbumPayload extends UpdateAlbumDto {
  image: IAlbumDocument['image']
}

export interface IUpdateOneAlbumFilter
  extends Partial<{
    id: IAlbumDocument['id']
  }> {}

export interface IDeleteManyAlbumsFilter
  extends Partial<{
    ids: DocumentIdArray
  }> {}

export interface IDeleteOneAlbumFilter
  extends Partial<{
    id: IAlbumDocument['id']
  }> {}

export interface IAlbumRepository {
  findAllWhere: (filter: IFindAllAlbumsFilter) => Promise<IAlbumDocumentArray>

  findOne: (filter: IFindOneAlbumFilter) => Promise<IAlbumDocument>

  createOne: (payload: ICreateOneAlbumPayload) => Promise<IAlbumDocument>

  updateOne: (
    filter: IUpdateOneAlbumFilter,
    payload: IUpdateOneAlbumPayload,
  ) => Promise<IAlbumDocument>

  deleteOne: (filter: IDeleteOneAlbumFilter) => Promise<IAlbumDocument>

  deleteMany: (filter: IDeleteManyAlbumsFilter) => Promise<DeleteResult>
}
