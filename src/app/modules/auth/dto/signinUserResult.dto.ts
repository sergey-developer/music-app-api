import { IUserDocument } from 'database/models/user'
import { ISessionDocument } from 'modules/../../../../database/models/session/model'

interface SigninUserResultDto
  extends Pick<IUserDocument, 'id' | 'role'>,
    Pick<ISessionDocument, 'token'> {}

export default SigninUserResultDto
