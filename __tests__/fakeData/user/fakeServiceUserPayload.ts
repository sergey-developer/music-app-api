import { internet, name } from 'faker'

import { IFakePayloadConfig } from '__tests__/fakeData/interface/fakePayload'
import { MaybeNull } from 'app/interface/utils'
import { MIN_LENGTH_PASSWORD } from 'database/models/user'
import { ICreateOneUserPayload } from 'modules/user/service'

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
