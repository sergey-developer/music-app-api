import { getFakeEmail } from '__tests__/fakeData/common'
import generateMongoId from 'database/utils/generateMongoId'
import { ICreateSessionPayload } from 'modules/session/repository'
import { UserRoleEnum } from 'modules/user/constants'

const fakeCreateSessionPayload = (): Required<ICreateSessionPayload> => ({
  email: getFakeEmail(),
  role: UserRoleEnum.User,
  userId: generateMongoId(),
})

export default fakeCreateSessionPayload
