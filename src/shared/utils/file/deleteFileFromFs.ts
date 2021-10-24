import fs from 'fs/promises'
import path from 'path'

import logger from 'lib/logger'

const deleteFileFromFs = async (
  dir: string,
  fileName: string,
): Promise<void> => {
  try {
    await fs.unlink(path.join(dir, fileName))
  } catch (error) {
    logger.warn(error.stack, {
      message: `File with filename "${fileName}" probably was not deleted from file system`,
    })
  }
}

export default deleteFileFromFs
