import ErrorKindsEnum from 'shared/constants/errorKinds'

export default (error: any) => error?.name === ErrorKindsEnum.ValidationError
