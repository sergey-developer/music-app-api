import curry from 'lodash/curry'

const checkString = (str: string, anotherStr: string): boolean =>
  str === anotherStr

export default curry(checkString)
