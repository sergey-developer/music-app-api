import { IAlbumDocument } from 'api/album/model'
import { IArtistDocument } from 'api/artist/model'
import { DocumentId } from 'database/interface/document'

export type GetAllTracksFilterDto = Partial<{
  artist: DocumentId<IArtistDocument>
  album: DocumentId<IAlbumDocument>
}>

export type GetAllTracksFilter = Partial<Pick<GetAllTracksFilterDto, 'album'>>
