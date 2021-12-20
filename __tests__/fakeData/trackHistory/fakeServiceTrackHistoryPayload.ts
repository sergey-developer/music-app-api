import { datatype } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface'
import { fakeEntityId } from '__tests__/utils'
import { ICreateOneTrackHistoryPayload } from 'modules/trackHistory/service'

const fakeRepoTrackHistoryPayload = (
  config: IFakePayloadConfig = {},
): Required<ICreateOneTrackHistoryPayload> => {
  const { isIncorrect } = config

  return {
    track: isIncorrect ? datatype.string() : fakeEntityId(),
    user: isIncorrect ? datatype.string() : fakeEntityId(),
  }
}

export default fakeRepoTrackHistoryPayload
