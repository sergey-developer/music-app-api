import { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import { IAlbumDocument } from 'api/album/model'
import { IArtistDocument } from 'api/artist/model'
import { ITrackDocumentArray } from 'api/track/interface'
import { ITrackDocument, ITrackModel } from 'api/track/model'
import { ModelNamesEnum } from 'database/constants'
import { DocumentId } from 'database/interface/document'

const toJson = require('@meanie/mongoose-to-json')

const TrackSchema = new Schema<ITrackDocument, ITrackModel, ITrackDocument>({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  youtube: {
    type: String,
    unique: true,
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: ModelNamesEnum.Album,
    required: true,
    autopopulate: true,
  },
})

TrackSchema.static('findByArtistId', async function (artistId: DocumentId) {
  const tracks: ITrackDocumentArray = await this.find().exec()

  return tracks.filter((track) => {
    const album = track.album as IAlbumDocument
    const artist = album.artist as IArtistDocument
    return artist.id === artistId
  })
})

TrackSchema.plugin(toJson)
TrackSchema.plugin(autopopulate)

const TrackModel = model<ITrackDocument, ITrackModel>(
  ModelNamesEnum.Track,
  TrackSchema,
)

export default TrackModel
