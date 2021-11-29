import { FilterQuery, Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import EntityNamesEnum from 'database/constants/entityNamesEnum'
import { DocumentId } from 'database/interface/document'
import { IAlbumDocument } from 'modules/album/model'
import { IArtistDocument } from 'modules/artist/model'
import {
  MAX_LENGTH_TRACK_NAME,
  MIN_LENGTH_TRACK_NAME,
} from 'modules/track/constants'
import { ITrackDocumentArray } from 'modules/track/interface'
import { ITrackDocument, ITrackModel } from 'modules/track/model'

const toJson = require('@meanie/mongoose-to-json')
const uniqueValidation = require('mongoose-unique-validator')

const TrackSchema = new Schema<ITrackDocument, ITrackModel, ITrackDocument>({
  name: {
    type: String,
    required: true,
    minlength: MIN_LENGTH_TRACK_NAME,
    maxlength: MAX_LENGTH_TRACK_NAME,
  },
  duration: {
    type: Number,
    required: true,
  },
  youtube: {
    type: String,
    unique: 'Track with such link "{VALUE}" already exists',
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: EntityNamesEnum.Album,
    required: true,
    autopopulate: true,
  },
})

// TODO: найти способ сделать это через базу данных
TrackSchema.static(
  'findByArtistId',
  async function (artistId: DocumentId, filter: FilterQuery<ITrackDocument>) {
    const tracks: ITrackDocumentArray = await this.find(filter).exec()

    return tracks.filter((track) => {
      if (track.album) {
        const album = track.album as IAlbumDocument

        if (album.artist) {
          const artist = album.artist as unknown as IArtistDocument
          return artist.id === artistId
        }
      }

      return false
    })
  },
)

TrackSchema.plugin(toJson)
TrackSchema.plugin(autopopulate)
TrackSchema.plugin(uniqueValidation)

const TrackModel = model<ITrackDocument, ITrackModel>(
  EntityNamesEnum.Track,
  TrackSchema,
)

export default TrackModel
