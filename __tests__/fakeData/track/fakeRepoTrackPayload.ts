import { datatype, internet, lorem } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface/fakePayload'
import generateEntityId from 'database/utils/generateEntityId'
import { MIN_LENGTH_TRACK_NAME } from 'modules/track/constants'
import { ICreateOneTrackPayload } from 'modules/track/repository'
import { MaybeNull } from 'shared/interface/utils'

const fakeRepoTrackPayload = (
  payload?: MaybeNull<Partial<Pick<ICreateOneTrackPayload, 'album'>>>,
  config: IFakePayloadConfig = {},
): Required<ICreateOneTrackPayload> => {
  const { isIncorrect } = config

  const nameLength = isIncorrect
    ? MIN_LENGTH_TRACK_NAME - 1
    : MIN_LENGTH_TRACK_NAME

  return {
    youtube: internet.url(),
    duration: datatype.number({
      min: 150000,
      max: 200000,
    }),
    name: lorem.word(nameLength),
    album: payload?.album || generateEntityId(),
  }
}

export default fakeRepoTrackPayload
