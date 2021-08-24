import { IAlbumModel } from 'api/album/model'
import { IArtistModel } from 'api/artist/model'
import { ModelId } from 'shared/interface/utils/model'

export type GetAllTracksFilterDto = Partial<{
  artist: ModelId<IArtistModel>
  album: ModelId<IAlbumModel>
}>

export type GetAllTracksFilter = Partial<Pick<GetAllTracksFilterDto, 'album'>>
