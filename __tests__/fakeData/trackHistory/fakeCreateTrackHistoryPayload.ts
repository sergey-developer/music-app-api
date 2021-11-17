import { getRandomString } from '__tests__/fakeData/common'
import { IFakeCreateConfig } from '__tests__/fakeData/interface/fakeCreate'
import generateMongoId from 'database/utils/generateMongoId'
import { ICreateTrackHistoryPayload } from 'modules/trackHistory/repository'

const fakeCreateTrackHistoryPayload = (
  config: IFakeCreateConfig = {},
): Required<ICreateTrackHistoryPayload> => {
  const { isIncorrect } = config

  return {
    track: isIncorrect ? getRandomString() : generateMongoId(),
    user: isIncorrect ? getRandomString() : generateMongoId(),
    listenDate: new Date().toISOString(),
  }
}

export default fakeCreateTrackHistoryPayload
