import { MulterError } from 'multer'

const isMulterError = (error: any): boolean => error instanceof MulterError

export default isMulterError
