import mongoose, { Schema, model } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import { IAlbumDocument, IAlbumModel } from 'api/album/model'
import { ArtistModel } from 'api/artist/model'
import { ImageModel } from 'api/image/model'
import uniqueValidation from 'database/plugins/uniqueValidation'

const toJson = require('@meanie/mongoose-to-json')

const AlbumSchema = new Schema<IAlbumDocument, IAlbumModel, IAlbumDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: ImageModel.modelName,
    default: null,
    autopopulate: true,
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: ArtistModel.modelName,
    required: true,
    autopopulate: true,
  },
})

AlbumSchema.post('findOneAndDelete', async function (album: IAlbumDocument) {
  try {
    const albumId = album._id!.toString()

    if (album.image) {
      const imageId = album.image.toString()
      await ImageModel.findByIdAndDelete(imageId)
    }

    // /* solving error with circular dependency */
    const TrackModel = mongoose.model('Track')
    await TrackModel.deleteMany({ album: albumId })
  } catch (error) {
    console.log({ error })
  }
})

AlbumSchema.plugin(toJson)
AlbumSchema.plugin(autopopulate)
AlbumSchema.plugin(uniqueValidation)

const AlbumModel = model<IAlbumDocument, IAlbumModel>('Album', AlbumSchema)

export default AlbumModel
