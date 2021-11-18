import NotFoundError from 'database/errors/NotFoundError'
import UnknownError from 'database/errors/UnknownError'
import ValidationError from 'database/errors/ValidationError'

const DatabaseError = {
  UnknownError,
  NotFoundError,
  ValidationError,
}

export default DatabaseError
