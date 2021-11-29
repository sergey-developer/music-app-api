import { lorem } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface/fakePayload'
import generateEntityId from 'database/utils/generateEntityId'
import { MIN_LENGTH_ALBUM_NAME } from 'modules/album/constants'
import { ICreateOneAlbumPayload } from 'modules/album/repository'
import { MaybeNull } from 'shared/interface/utils'

const fakeAlbumPayload = (
  payload?: MaybeNull<Partial<Pick<ICreateOneAlbumPayload, 'artist'>>>,
  config: IFakePayloadConfig = {},
): Required<ICreateOneAlbumPayload> => {
  const { isIncorrect } = config

  const nameLength = isIncorrect
    ? MIN_LENGTH_ALBUM_NAME - 1
    : MIN_LENGTH_ALBUM_NAME

  return {
    artist: payload?.artist || generateEntityId(),
    name: lorem.word(nameLength),
    releaseDate: new Date().toISOString(),
    image: null,
  }
}

export default fakeAlbumPayload
