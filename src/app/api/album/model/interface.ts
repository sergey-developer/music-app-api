import { Model } from 'mongoose'

import { IArtistDocument } from 'api/artist/model'
import { IImageDocument } from 'api/image/model'
import { CustomDocument, PopulatedDoc } from 'database/interface/document'
import { DateType } from 'shared/interface/common'
import { MaybeNull } from 'shared/interface/utils/common'

export interface IAlbumDocument extends CustomDocument {
  name: string
  releaseDate: DateType<Date>
  image: MaybeNull<PopulatedDoc<IImageDocument>>
  artist: PopulatedDoc<IArtistDocument>
}

export interface IAlbumModel extends Model<IAlbumDocument> {}
