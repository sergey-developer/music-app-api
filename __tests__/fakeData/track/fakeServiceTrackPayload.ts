import { datatype, internet, lorem } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface/fakePayload'
import generateEntityId from 'database/utils/generateEntityId'
import { MIN_LENGTH_TRACK_NAME } from 'modules/track/constants'
import { ICreateOneTrackPayload } from 'modules/track/service'
import { MaybeNull } from 'shared/interface/utils'

const fakeServiceTrackPayload = (
  payload?: MaybeNull<Partial<Pick<ICreateOneTrackPayload, 'album' | 'user'>>>,
  config: IFakePayloadConfig = {},
): Required<ICreateOneTrackPayload> => {
  const { isIncorrect } = config

  const nameLength = isIncorrect
    ? MIN_LENGTH_TRACK_NAME - 1
    : MIN_LENGTH_TRACK_NAME

  return {
    youtube: internet.url(),
    duration: {
      minutes: datatype.number({
        min: 0,
        max: 10,
      }),
      seconds: datatype.number({
        min: 0,
        max: 59,
      }),
    },
    name: lorem.word(nameLength),
    album: payload?.album || generateEntityId(),
    user: payload?.user || generateEntityId(),
  }
}

export default fakeServiceTrackPayload
