import { datatype, internet } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface/fakePayload'
import generateEntityId from 'database/utils/generateEntityId'
import { ICreateOneSessionPayload } from 'modules/session/repository'
import { UserRoleEnum } from 'modules/user/constants'

const fakeRepoSessionPayload = (
  config: IFakePayloadConfig = {},
): Required<ICreateOneSessionPayload> => {
  const { isIncorrect } = config

  return {
    email: internet.email(),
    role: UserRoleEnum.User,
    userId: isIncorrect ? datatype.string() : generateEntityId(),
  }
}

export default fakeRepoSessionPayload
