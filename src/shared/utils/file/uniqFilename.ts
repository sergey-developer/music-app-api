import path from 'path'

import { nanoid } from 'nanoid'

const uniqFilename = (filenameWithExtension: string): string => {
  const uniqId = nanoid()
  const fileExtension = path.extname(filenameWithExtension)

  return `${uniqId}${fileExtension}`
}

export default uniqFilename
