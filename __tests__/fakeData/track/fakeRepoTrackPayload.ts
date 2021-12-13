import { datatype, internet, lorem } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { MaybeNull } from 'app/interface/utils'
import { MIN_LENGTH_TRACK_NAME } from 'database/models/track'
import { ICreateOneTrackPayload } from 'modules/track/repository'

const fakeRepoTrackPayload = (
  payload?: MaybeNull<Partial<Pick<ICreateOneTrackPayload, 'album'>>>,
  config: IFakePayloadConfig = {},
): Required<ICreateOneTrackPayload> => {
  const { isIncorrect } = config

  const name = isIncorrect
    ? lorem.word(MIN_LENGTH_TRACK_NAME - 1)
    : lorem.words(2)

  return {
    name,
    youtube: internet.url(),
    duration: datatype.number({
      min: 150000,
      max: 200000,
    }),
    album: payload?.album || fakeEntityId(),
  }
}

export default fakeRepoTrackPayload
