import { internet } from 'faker'

import { MIN_LENGTH_PASSWORD } from 'database/models/user'

const getFakePassword = (): string => {
  return internet.password(MIN_LENGTH_PASSWORD)
}

export default getFakePassword
