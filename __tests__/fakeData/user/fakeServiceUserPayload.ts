import { internet, name } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface/fakePayload'
import { MIN_LENGTH_PASSWORD } from 'modules/user/constants'
import { ICreateOneUserPayload } from 'modules/user/service'
import { MaybeNull } from 'shared/interface/utils'

const fakeServiceUserPayload = (
  payload?: MaybeNull<Partial<ICreateOneUserPayload>>,
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
  }
}

export default fakeServiceUserPayload
