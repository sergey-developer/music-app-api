import path from 'path'

import { nanoid } from 'nanoid'

const uniqFileName = (fileName: string): string => {
  const uniqId: string = nanoid()
  const fileExtension: string = path.extname(fileName)

  return `${uniqId}${fileExtension}`
}

export default uniqFileName
