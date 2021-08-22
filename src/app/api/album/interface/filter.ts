import { IArtistModel } from 'api/artist/model'
import { ModelId } from 'shared/interface/utils/model'

export type GetAllAlbumsFilter = Partial<{ artist: ModelId<IArtistModel> }>
