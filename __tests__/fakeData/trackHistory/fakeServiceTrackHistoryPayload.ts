import { datatype } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface/fakePayload'
import generateEntityId from 'database/utils/generateEntityId'
import { ICreateOneTrackHistoryPayload } from 'modules/trackHistory/service'

const fakeRepoTrackHistoryPayload = (
  config: IFakePayloadConfig = {},
): Required<ICreateOneTrackHistoryPayload> => {
  const { isIncorrect } = config

  return {
    track: isIncorrect ? datatype.string() : generateEntityId(),
    user: generateEntityId(),
  }
}

export default fakeRepoTrackHistoryPayload
