import { internet, name } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface'
import { MaybeNull } from 'app/interface/utils'
import { MIN_LENGTH_PASSWORD } from 'database/models/user'
import { UserRoleEnum } from 'modules/user/constants'
import { ICreateOneUserPayload } from 'modules/user/repository'

const fakeRepoUserPayload = (
  payload?: MaybeNull<Partial<Pick<ICreateOneUserPayload, 'role'>>>,
  config: IFakePayloadConfig = {},
): Required<ICreateOneUserPayload> => {
  const { isIncorrect } = config

  const passwordLength = isIncorrect
    ? MIN_LENGTH_PASSWORD - 1
    : MIN_LENGTH_PASSWORD

  return {
    username: name.findName(),
    email: internet.email(),
    password: internet.password(passwordLength),
    role: payload?.role || UserRoleEnum.User,
  }
}

export default fakeRepoUserPayload
