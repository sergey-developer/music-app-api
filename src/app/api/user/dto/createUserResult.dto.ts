import { ISessionDocument } from 'api/session/model'
import { IUserDocument } from 'api/user/model'

interface CreateUserResultDto
  extends Pick<IUserDocument, 'id' | 'role'>,
    Pick<ISessionDocument, 'token'> {}

export default CreateUserResultDto
