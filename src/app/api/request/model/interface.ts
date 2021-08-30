import { Model } from 'mongoose'

import { IAlbumDocument } from 'api/album/model'
import { IArtistDocument } from 'api/artist/model'
import { RequestEntityNameEnum, RequestStatusEnum } from 'api/request/interface'
import { ITrackDocument } from 'api/track/model'
import { IUserDocument } from 'api/user/model'
import { CustomDocument, PopulatedDoc } from 'database/interface/document'
import { MaybeNull } from 'shared/interface/utils/common'

export interface IRequestDocument extends CustomDocument {
  entityName: RequestEntityNameEnum
  entity:
    | PopulatedDoc<IArtistDocument>
    | PopulatedDoc<IAlbumDocument>
    | PopulatedDoc<ITrackDocument>
  creator: PopulatedDoc<IUserDocument>
  reason?: MaybeNull<string>
  status?: RequestStatusEnum
}

export interface IRequestModel extends Model<IRequestDocument> {}
