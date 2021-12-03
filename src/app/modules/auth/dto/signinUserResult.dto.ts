import { ISessionDocument } from 'database/models/session'
import { IUserDocument } from 'database/models/user'

interface SigninUserResultDto
  extends Pick<IUserDocument, 'id' | 'role'>,
    Pick<ISessionDocument, 'token'> {}

export default SigninUserResultDto
