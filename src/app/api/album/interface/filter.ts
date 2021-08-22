import { IArtistModel } from 'api/artist/model'
import { ModelId } from 'shared/interface/utils/model'

export type GetAllAlbumsQueryString = Partial<{ artist: ModelId<IArtistModel> }>
