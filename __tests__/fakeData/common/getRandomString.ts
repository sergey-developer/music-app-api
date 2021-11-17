import { datatype } from 'faker'

const getRandomString = (): string => {
  return datatype.string()
}

export default getRandomString
