import { ISessionDocument } from 'database/models/session'
import { IUserDocument } from 'database/models/user'

interface SignupUserResultDto
  extends Pick<IUserDocument, 'id' | 'role'>,
    Pick<ISessionDocument, 'token'> {}

export default SignupUserResultDto
