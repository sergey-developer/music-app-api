import { datatype } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { MaybeNull } from 'app/interface/utils'
import { ICreateOneTrackHistoryPayload } from 'modules/trackHistory/repository'

const fakeRepoTrackHistoryPayload = (
  payload?: MaybeNull<Partial<Pick<ICreateOneTrackHistoryPayload, 'track'>>>,
  config: IFakePayloadConfig = {},
): Required<ICreateOneTrackHistoryPayload> => {
  const { isIncorrect } = config

  return {
    track: isIncorrect ? datatype.string() : payload?.track || fakeEntityId(),
    user: isIncorrect ? datatype.string() : fakeEntityId(),
    listenDate: new Date().toISOString(),
  }
}

export default fakeRepoTrackHistoryPayload
