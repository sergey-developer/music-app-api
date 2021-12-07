import { inject } from 'tsyringe'
import { Logger } from 'winston'

import { DiTokenEnum } from 'lib/dependency-injection'

class BaseService {
  public constructor(
    @inject(DiTokenEnum.Logger)
    protected readonly logger?: Logger,
  ) {}
}

export default BaseService
