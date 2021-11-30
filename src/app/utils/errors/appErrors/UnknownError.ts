import { CustomError } from 'ts-custom-error'

class UnknownError extends CustomError {
  public constructor(msg: string) {
    super(msg)
  }
}

export default UnknownError
