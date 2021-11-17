import { FilterQuery, Model } from 'mongoose'

import { DocumentId, PopulatedDoc } from 'database/interface/document'
import { IAlbumDocument } from 'modules/album/model'
import { ITrackDocumentArray } from 'modules/track/interface'
import { MaybeNull } from 'shared/interface/utils'

export interface ITrackDocument {
  id: DocumentId
  name: string
  duration: string
  album: PopulatedDoc<MaybeNull<IAlbumDocument>>
  youtube?: string
}

export interface ITrackModel extends Model<ITrackDocument> {
  findByArtistId(
    id: ITrackDocument['id'],
    filter: FilterQuery<ITrackDocument>,
  ): Promise<ITrackDocumentArray>
}
