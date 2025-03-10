import { Document, Model, PopulatedDoc } from 'mongoose'

import { MaybeNull } from 'app/interface/utils'
import { EntityNamesEnum } from 'database/constants'
import { DocumentId } from 'database/interface/document'
import { IAlbumDocument } from 'database/models/album'
import { IArtistDocument } from 'database/models/artist'
import { ITrackDocument } from 'database/models/track'
import { IUserDocument } from 'database/models/user'
import { RequestStatusEnum } from 'modules/request/constants'

export interface IRequestDocument extends Pick<Document, 'populated'> {
  id: DocumentId
  entityName:
    | EntityNamesEnum.Artist
    | EntityNamesEnum.Album
    | EntityNamesEnum.Track
  entity: PopulatedDoc<IArtistDocument | IAlbumDocument | ITrackDocument>
  creator: PopulatedDoc<IUserDocument>
  status: RequestStatusEnum
  reason: MaybeNull<string>
}

export interface IRequestDocumentArray extends Array<IRequestDocument> {}

export interface IRequestModel extends Model<IRequestDocument> {}
