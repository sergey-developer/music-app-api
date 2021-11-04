import { internet, name } from 'faker'

import { MIN_LENGTH_PASSWORD, UserRoleEnum } from 'modules/user/constants'
import { ICreateUserPayload } from 'modules/user/repository'

const fakeCreateUserPayload = (
  password?: ICreateUserPayload['password'],
  role?: ICreateUserPayload['role'],
): Required<ICreateUserPayload> => {
  return {
    username: name.findName(),
    email: internet.email(),
    password: password || internet.password(MIN_LENGTH_PASSWORD),
    role: role || UserRoleEnum.User,
  }
}

export default fakeCreateUserPayload
