import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

const omitUndefined = (obj: object) => {
  return omitBy(obj, isUndefined)
}

export default omitUndefined
