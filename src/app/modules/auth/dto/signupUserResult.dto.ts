import { IUserDocument } from 'database/models/user'
import { ISessionDocument } from 'modules/../../../../database/models/session/model'

interface SignupUserResultDto
  extends Pick<IUserDocument, 'id' | 'role'>,
    Pick<ISessionDocument, 'token'> {}

export default SignupUserResultDto
