import { internet, name } from 'faker'

import { IFakeCreateConfig } from '__tests__/fakeData/interface/fakeCreate'
import { MIN_LENGTH_PASSWORD, UserRoleEnum } from 'modules/user/constants'
import { ICreateUserPayload } from 'modules/user/repository'
import { MaybeNull } from 'shared/interface/utils'

const fakeCreateUserPayload = (
  role?: MaybeNull<ICreateUserPayload['role']>,
  config: IFakeCreateConfig = {},
): Required<ICreateUserPayload> => {
  const { isIncorrect } = config

  const passwordLength = isIncorrect
    ? MIN_LENGTH_PASSWORD - 1
    : MIN_LENGTH_PASSWORD

  return {
    username: name.findName(),
    email: internet.email(),
    password: internet.password(passwordLength),
    role: role || UserRoleEnum.User,
  }
}

export default fakeCreateUserPayload
