import { Model } from 'mongoose'

import { IAlbumDocument } from 'api/album/model'
import { IArtistDocument } from 'api/artist/model'
import { RequestStatusEnum } from 'api/request/constants'
import { ITrackDocument } from 'api/track/model'
import { IUserDocument } from 'api/user/model'
import { ModelNamesEnum } from 'database/constants'
import { CustomDocument, PopulatedDoc } from 'database/interface/document'
import { MaybeNull } from 'shared/interface/utils/common'

export interface IRequestDocument extends CustomDocument {
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
