import { CustomError } from 'ts-custom-error'

class EmptyFilterError extends CustomError {
  public constructor(msg: string) {
    super(msg)
  }
}

export default EmptyFilterError
