import { lorem } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { MaybeNull } from 'app/interface/utils'
import { MIN_LENGTH_ALBUM_NAME } from 'database/models/album'
import { ICreateOneAlbumPayload } from 'modules/album/repository'

const fakeAlbumPayload = (
  payload?: MaybeNull<Partial<Pick<ICreateOneAlbumPayload, 'artist'>>>,
  config: IFakePayloadConfig = {},
): Required<ICreateOneAlbumPayload> => {
  const { isIncorrect } = config

  const name = isIncorrect
    ? lorem.word(MIN_LENGTH_ALBUM_NAME - 1)
    : lorem.words(2)

  return {
    name,
    artist: payload?.artist || fakeEntityId(),
    releaseDate: new Date().toISOString(),
    image: null,
  }
}

export default fakeAlbumPayload
