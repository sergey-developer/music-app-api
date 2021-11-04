import { internet } from 'faker'

import { MIN_LENGTH_PASSWORD } from 'modules/user/constants'

const getFakePassword = (): string => {
  return internet.password(MIN_LENGTH_PASSWORD)
}

export default getFakePassword
