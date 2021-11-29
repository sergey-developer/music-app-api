import { lorem, name } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface/fakePayload'
import { MIN_LENGTH_ARTIST_INFO } from 'modules/artist/constants'
import { ICreateOneArtistPayload } from 'modules/artist/repository'

const fakeArtistPayload = (
  config: IFakePayloadConfig = {},
): Required<ICreateOneArtistPayload> => {
  const { isIncorrect } = config

  const infoLength = isIncorrect
    ? MIN_LENGTH_ARTIST_INFO - 1
    : MIN_LENGTH_ARTIST_INFO

  return {
    name: name.findName(),
    info: lorem.word(infoLength),
    photo: null,
  }
}

export default fakeArtistPayload
