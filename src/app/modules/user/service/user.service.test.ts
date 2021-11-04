import { Types } from 'mongoose'
import { container as DiContainer } from 'tsyringe'

import { EntityNamesEnum } from 'database/constants/entityNames'
import * as db from 'database/utils/db'
import generateMongoId from 'database/utils/generateMongoId'
import getModelName from 'database/utils/getModelName'
import { getFakeEmail } from 'fakeData/common'
import { fakeCreateUserPayload } from 'fakeData/user'
import { UserRoleEnum } from 'modules/user/constants'
import { UserModel } from 'modules/user/model'
import { UserService } from 'modules/user/service'
import {
  isBadRequestError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'

let userService: UserService

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  DiContainer.register(getModelName(EntityNamesEnum.User), {
    useValue: UserModel,
  })

  userService = DiContainer.resolve(UserService)
})

afterEach(async () => {
  DiContainer.clearInstances()
  await db.clear()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('User service', () => {
  describe('Get one user by email', () => {
    let getOneUserByEmailSpy: jest.SpyInstance

    beforeEach(async () => {
      getOneUserByEmailSpy = jest.spyOn(userService, 'getOneByEmail')
    })

    it('which exists', async () => {
      const createUserPayload = fakeCreateUserPayload()
      const newUser = await userService.createOne(createUserPayload)
      const user = await userService.getOneByEmail(newUser.email)

      expect(getOneUserByEmailSpy).toBeCalledTimes(1)
      expect(getOneUserByEmailSpy).toBeCalledWith(newUser.email)
      expect(user.email).toBe(newUser.email)
    })

    it('which not exists', async () => {
      const fakeEmail = getFakeEmail()

      try {
        await userService.getOneByEmail(fakeEmail)
      } catch (error) {
        expect(getOneUserByEmailSpy).toBeCalledTimes(1)
        expect(getOneUserByEmailSpy).toBeCalledWith(fakeEmail)
        expect(isNotFoundError(error)).toBe(true)
      }
    })
  })

  describe('Create one user', () => {
    let createOneUserSpy: jest.SpyInstance

    beforeEach(async () => {
      createOneUserSpy = jest.spyOn(userService, 'createOne')
    })

    it('with correct data', async () => {
      const payload = fakeCreateUserPayload()
      const user = await userService.createOne(payload)

      expect(createOneUserSpy).toBeCalledTimes(1)
      expect(createOneUserSpy).toBeCalledWith(payload)
      expect(user._id).toBeInstanceOf(Types.ObjectId)
      expect(user.username).toBe(payload.username)
      expect(user.email).toBe(payload.email)
      expect(user.password).not.toBe(payload.password)
      expect(user.role).toBe(UserRoleEnum.User)
    })

    it('with incorrect data throws bad request error', async () => {
      const payload = fakeCreateUserPayload('123')

      try {
        await userService.createOne(payload)
      } catch (error) {
        expect(createOneUserSpy).toBeCalledTimes(1)
        expect(createOneUserSpy).toBeCalledWith(payload)
        expect(isBadRequestError(error)).toBe(true)
      }
    })
  })

  describe('Delete one user by id', () => {
    let deleteOneUserByIdSpy: jest.SpyInstance

    beforeEach(async () => {
      deleteOneUserByIdSpy = jest.spyOn(userService, 'deleteOneById')
    })

    it('which exists', async () => {
      const createUserPayload = fakeCreateUserPayload()
      const newUser = await userService.createOne(createUserPayload)
      const deletedUser = await userService.deleteOneById(newUser.id)

      expect(deleteOneUserByIdSpy).toBeCalledTimes(1)
      expect(deleteOneUserByIdSpy).toBeCalledWith(newUser.id)
      expect(deletedUser).toBeDefined()
    })

    it('which not exists', async () => {
      const fakeMongoId = generateMongoId()

      try {
        await userService.deleteOneById(fakeMongoId)
      } catch (error) {
        expect(deleteOneUserByIdSpy).toBeCalledTimes(1)
        expect(deleteOneUserByIdSpy).toBeCalledWith(fakeMongoId)
        expect(isNotFoundError(error)).toBe(true)
      }
    })
  })
})
