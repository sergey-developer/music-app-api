import fs from 'fs/promises'
import path from 'path'

const deleteFile = async (dir: string, filename: string): Promise<void> => {
  return fs.unlink(path.join(dir, filename))
}

export default deleteFile
