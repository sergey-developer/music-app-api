import { ISessionDocument } from 'modules/session/model'
import { IUserDocument } from 'modules/user/model'

interface SignupUserResultDto
  extends Pick<IUserDocument, 'id' | 'role'>,
    Pick<ISessionDocument, 'token'> {}

export default SignupUserResultDto
