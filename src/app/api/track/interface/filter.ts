import { IAlbumModel } from 'api/album/model'
import { IArtistModel } from 'api/artist/model'
import { ModelId } from 'shared/interface/utils/model'

export type GetAllTracksQueryString = Partial<{
  artist: ModelId<IArtistModel>
  album: ModelId<IAlbumModel>
}>
