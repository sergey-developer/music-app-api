import { CustomError } from 'ts-custom-error'

class NotFoundError extends CustomError {
  public constructor(msg: string) {
    super(msg)
  }
}

export default NotFoundError
