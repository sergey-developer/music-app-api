import { Model, PopulatedDoc } from 'mongoose'

import { MaybeNull } from 'app/interface/utils'
import EntityNamesEnum from 'database/constants/entityNamesEnum'
import { DocumentId } from 'database/interface/document'
import { IAlbumDocument } from 'database/models/album'
import { IArtistDocument } from 'database/models/artist'
import { ITrackDocument } from 'database/models/track'
import { IUserDocument } from 'database/models/user'
import { RequestStatusEnum } from 'modules/request/constants'

export interface IRequestDocument {
  id: DocumentId
  entityName: EntityNamesEnum
  entity: PopulatedDoc<IArtistDocument | IAlbumDocument | ITrackDocument>
  creator: PopulatedDoc<IUserDocument>
  status: RequestStatusEnum
  reason: MaybeNull<string>
}

export interface IRequestModel extends Model<IRequestDocument> {}
