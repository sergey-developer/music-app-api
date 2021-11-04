import { internet } from 'faker'

const getFakeEmail = (): string => {
  return internet.email()
}

export default getFakeEmail
