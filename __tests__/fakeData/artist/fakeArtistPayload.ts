import { lorem } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface'
import {
  MIN_LENGTH_ARTIST_INFO,
  MIN_LENGTH_ARTIST_NAME,
} from 'database/models/artist'
import { ICreateOneArtistPayload } from 'modules/artist/repository'

const fakeArtistPayload = (
  config: IFakePayloadConfig = {},
): Required<ICreateOneArtistPayload> => {
  const { isIncorrect } = config

  const info = isIncorrect
    ? lorem.word(MIN_LENGTH_ARTIST_INFO - 1)
    : lorem.words(5)

  const name = isIncorrect
    ? lorem.word(MIN_LENGTH_ARTIST_NAME - 1)
    : lorem.words(2)

  return {
    name,
    info,
    photo: null,
  }
}

export default fakeArtistPayload
