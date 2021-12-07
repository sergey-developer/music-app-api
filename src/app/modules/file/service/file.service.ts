import fs from 'fs/promises'
import path from 'path'

import { IConfig } from 'config'
import { inject, singleton } from 'tsyringe'

import BaseService from 'app/services/base.service'
import { AppUnknownError } from 'app/utils/errors/appErrors'
import { DiTokenEnum } from 'lib/dependency-injection'
import { IFileService } from 'modules/file/service/interface'

@singleton()
class FileService extends BaseService implements IFileService {
  constructor(
    @inject(DiTokenEnum.Config)
    private readonly config: IConfig,
  ) {
    super()
  }

  public deleteOneFromFs: IFileService['deleteOneFromFs'] = async (
    dir,
    fileName,
  ) => {
    try {
      await fs.unlink(path.join(dir, fileName))
    } catch (error: any) {
      this.logger!.warn(error.stack, {
        message: `File with filename "${fileName}" probably was not deleted from file system`,
      })

      throw new AppUnknownError(error.message)
    }
  }
}

export default FileService
