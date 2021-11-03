import { Error as MongooseError, Types } from 'mongoose'
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
  container.register(getModelName(EntityNamesEnum.User), {
    useValue: UserModel,
  })

  userRepository = container.resolve(UserRepository)
})

afterEach(async () => {
  jest.resetAllMocks()
  container.clearInstances()
  await db.clear()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('User repository', () => {
  describe('Create one user', () => {
    let createOneUserSpy: jest.SpyInstance

    beforeEach(() => {
      createOneUserSpy = jest.spyOn(userRepository, 'createOne')
    })

    it('with role "user"', async () => {
      const payload: ICreateUserPayload = {
        username: 'user 1',
        email: 'user@mail.ru',
        password: '12345678',
      }

      const user = await userRepository.createOne(payload)

      expect(createOneUserSpy).toHaveBeenCalledTimes(1)
      expect(createOneUserSpy).toHaveBeenCalledWith(payload)
      expect(user._id).toBeInstanceOf(Types.ObjectId)
      expect(user.username).toBe(payload.username)
      expect(user.email).toBe(payload.email)
      expect(user.password).not.toBe(payload.password)
      expect(user.role).toBe(UserRoleEnum.User)
    })

    it('with role "moderator"', async () => {
      const payload: ICreateUserPayload = {
        username: 'moderator 1',
        email: 'moderator@mail.ru',
        password: '12345678',
        role: UserRoleEnum.Moderator,
      }

      const user = await userRepository.createOne(payload)

      expect(createOneUserSpy).toHaveBeenCalledTimes(1)
      expect(createOneUserSpy).toHaveBeenCalledWith(payload)
      expect(user._id).toBeInstanceOf(Types.ObjectId)
      expect(user.username).toBe(payload.username)
      expect(user.email).toBe(payload.email)
      expect(user.password).not.toBe(payload.password)
      expect(user.role).toBe(UserRoleEnum.Moderator)
    })

    it('with invalid data throws validation error', async () => {
      const payload: ICreateUserPayload = {
        username: 'u1',
        email: 'moderator@mail.ru',
        password: '123',
      }

      try {
        await userRepository.createOne(payload)
      } catch (error) {
        expect(createOneUserSpy).toHaveBeenCalledTimes(1)
        expect(createOneUserSpy).toBeCalledWith(payload)
        await expect(createOneUserSpy).rejects.toThrow(
          MongooseError.ValidationError,
        )
      }
    })
  })
})
