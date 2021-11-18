import { Model } from 'mongoose'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import { DocumentId, PopulatedDoc } from 'database/interface/document'
import { IAlbumDocument } from 'modules/album/model'
import { IArtistDocument } from 'modules/artist/model'
import { RequestStatusEnum } from 'modules/request/constants'
import { ITrackDocument } from 'modules/track/model'
import { IUserDocument } from 'modules/user/model'
import { MaybeNull } from 'shared/interface/utils'

export interface IRequestDocument {
  id: DocumentId
  entityName: EntityNamesEnum
  entity: PopulatedDoc<
    MaybeNull<IArtistDocument | IAlbumDocument | ITrackDocument>
  >
  creator: PopulatedDoc<MaybeNull<IUserDocument>>
  status: RequestStatusEnum
  reason: MaybeNull<string>
}

export interface IRequestModel extends Model<IRequestDocument> {}
