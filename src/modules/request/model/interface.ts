import { Model } from 'mongoose'

import { ModelNamesEnum } from 'database/constants'
import { PopulatedDoc } from 'database/interface/document'
import { IAlbumDocument } from 'modules/album/model'
import { IArtistDocument } from 'modules/artist/model'
import { RequestStatusEnum } from 'modules/request/constants'
import { ITrackDocument } from 'modules/track/model'
import { IUserDocument } from 'modules/user/model'
import { MaybeNull } from 'shared/interface/utils/common'

export interface IRequestDocument {
  id: string
  entityName: ModelNamesEnum
  entity:
    | PopulatedDoc<IArtistDocument>
    | PopulatedDoc<IAlbumDocument>
    | PopulatedDoc<ITrackDocument>
  creator: PopulatedDoc<IUserDocument>
  status: RequestStatusEnum
  reason?: MaybeNull<string>
}

export interface IRequestModel extends Model<IRequestDocument> {}
