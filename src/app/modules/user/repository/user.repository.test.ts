import { Types } from 'mongoose'
import { container } from 'tsyringe'

import { EntityNamesEnum } from 'database/constants/entityNames'
import * as db from 'database/utils/db'
import getModelName from 'database/utils/getModelName'
import { UserRoleEnum } from 'modules/user/constants'
import { UserModel } from 'modules/user/model'
import { ICreateUserPayload, UserRepository } from 'modules/user/repository'

let userRepository: UserRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  jest.resetAllMocks()

  container.register(getModelName(EntityNamesEnum.User), {
    useValue: UserModel,
  })

  userRepository = container.resolve(UserRepository)
})

afterEach(async () => {
  await db.clear()
  container.clearInstances()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('User repository', () => {
  describe('Create user', () => {
    beforeEach(() => {
      jest.spyOn(userRepository, 'createOne')
    })

    it('create one user with role "user"', async () => {
      const payload: ICreateUserPayload = {
        username: 'user 1',
        email: 'user@mail.ru',
        password: '12345678',
      }

      const user = await userRepository.createOne(payload)

      expect(user._id).toBeInstanceOf(Types.ObjectId)
      expect(user.username).toBe(payload.username)
      expect(user.email).toBe(payload.email)
      expect(user.password).not.toBe(payload.password)
      expect(user.role).toBe(UserRoleEnum.User)
    })

    it('create one user with role "moderator"', async () => {
      const payload: ICreateUserPayload = {
        username: 'moderator 1',
        email: 'moderator@mail.ru',
        password: '12345678',
        role: UserRoleEnum.Moderator,
      }

      const user = await userRepository.createOne(payload)

      expect(user._id).toBeInstanceOf(Types.ObjectId)
      expect(user.username).toBe(payload.username)
      expect(user.email).toBe(payload.email)
      expect(user.password).not.toBe(payload.password)
      expect(user.role).toBe(UserRoleEnum.Moderator)
    })
  })
})
