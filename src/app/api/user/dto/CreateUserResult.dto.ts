import { ISessionDocument } from 'api/session/model'
import { IUserDocument } from 'api/user/model'

interface CreateUserResultDto
  extends Pick<IUserDocument, 'role'>,
    Pick<ISessionDocument, 'token'> {}

export default CreateUserResultDto
