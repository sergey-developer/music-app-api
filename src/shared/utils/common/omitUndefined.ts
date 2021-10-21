import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

const omitUndefined = <T extends object>(obj: T) => {
  return omitBy<T>(obj, isUndefined)
}

export default omitUndefined
