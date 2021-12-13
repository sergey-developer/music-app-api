import { datatype, internet } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { ICreateOneSessionPayload } from 'modules/session/repository'
import { UserRoleEnum } from 'modules/user/constants'

const fakeRepoSessionPayload = (
  config: IFakePayloadConfig = {},
): Required<ICreateOneSessionPayload> => {
  const { isIncorrect } = config

  return {
    email: isIncorrect ? datatype.string() : internet.email(),
    role: UserRoleEnum.User,
    userId: isIncorrect ? datatype.string() : fakeEntityId(),
  }
}

export default fakeRepoSessionPayload
