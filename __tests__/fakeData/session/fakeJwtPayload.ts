import { getFakeEmail } from '__tests__/fakeData/common'
import generateMongoId from 'database/utils/generateMongoId'
import { JwtPayload } from 'modules/session/interface'
import { UserRoleEnum } from 'modules/user/constants'

const fakeJwtPayload = (): JwtPayload => ({
  email: getFakeEmail(),
  role: UserRoleEnum.User,
  userId: generateMongoId(),
})

export default fakeJwtPayload
