import { Model, PopulatedDoc } from 'mongoose'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import { DocumentId } from 'database/interface/document'
import { IAlbumDocument } from 'modules/album/model'
import { IArtistDocument } from 'modules/artist/model'
import { RequestStatusEnum } from 'modules/request/constants'
import { ITrackDocument } from 'modules/track/model'
import { IUserDocument } from 'modules/user/model'
import { MaybeNull } from 'shared/interface/utils'

export interface IRequestDocument {
  id: DocumentId
  entityName: EntityNamesEnum
  entity: PopulatedDoc<IArtistDocument | IAlbumDocument | ITrackDocument>
  creator: PopulatedDoc<IUserDocument>
  status: RequestStatusEnum
  reason: MaybeNull<string>
}

export interface IRequestModel extends Model<IRequestDocument> {}
