import { IArtistModel } from 'api/artist/model'
import { ModelId } from 'shared/interface/utils/model'

export type GetAllAlbumsFilterDto = Partial<{ artist: ModelId<IArtistModel> }>
