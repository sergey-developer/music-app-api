import { container as DiContainer } from 'tsyringe'

import { AlbumModel } from 'database/models/album'
import { ArtistModel } from 'database/models/artist'
import { RequestModel } from 'database/models/request'
import { SessionModel } from 'database/models/session'
import { TrackModel } from 'database/models/track'
import { TrackHistoryModel } from 'database/models/trackHistory'
import { UserModel } from 'database/models/user'
import { DiTokenEnum } from 'lib/dependency-injection'

const DiTokenToModel = {
  [DiTokenEnum.Artist]: ArtistModel,
  [DiTokenEnum.Album]: AlbumModel,
  [DiTokenEnum.Track]: TrackModel,
  [DiTokenEnum.TrackHistory]: TrackHistoryModel,
  [DiTokenEnum.Request]: RequestModel,
  [DiTokenEnum.User]: UserModel,
  [DiTokenEnum.Session]: SessionModel,
}

const registerModel = (token: DiTokenEnum) => {
  const model = DiTokenToModel[token]
  DiContainer.register(token, { useValue: model })
}

const registerModels = () => {
  Object.keys(DiTokenToModel).forEach((token) => {
    registerModel(token as DiTokenEnum)
  })
}

export { DiTokenToModel, registerModel }
export default registerModels
