import { MulterError } from 'multer'

const isMulterError = (error: unknown): boolean => error instanceof MulterError

export default isMulterError
