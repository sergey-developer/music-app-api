import curry from 'lodash/curry'

const stringEqual = (str1: string, str2: string): boolean => str1 === str2

export default curry(stringEqual)
