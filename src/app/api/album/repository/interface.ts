import { CreateAlbumDto } from 'api/album/dto'
import { AlbumDocumentArray, GetAllAlbumsFilterDto } from 'api/album/interface'
import { IAlbumDocument } from 'api/album/model'
import { DocumentId } from 'database/interface/document'
import { MaybeNull } from 'shared/interface/utils/common'

export interface IAlbumRepository {
  findAll: () => Promise<AlbumDocumentArray>
  findAllWhere: (filter: GetAllAlbumsFilterDto) => Promise<AlbumDocumentArray>
  createOne: (payload: CreateAlbumDto) => Promise<IAlbumDocument>
  findOneById: (
    id: DocumentId<IAlbumDocument>,
  ) => Promise<MaybeNull<IAlbumDocument>>
}
