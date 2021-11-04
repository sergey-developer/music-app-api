import { Error as MongooseError, Types } from 'mongoose'
import { container as DiContainer } from 'tsyringe'

import { EntityNamesEnum } from 'database/constants/entityNames'
import * as db from 'database/utils/db'
import generateMongoId from 'database/utils/generateMongoId'
import getModelName from 'database/utils/getModelName'
import { getFakeEmail } from 'fakeData/common'
import { fakeCreateUserPayload } from 'fakeData/user'
import { UserRoleEnum } from 'modules/user/constants'
import { UserModel } from 'modules/user/model'
import { UserRepository } from 'modules/user/repository'

let userRepository: UserRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  DiContainer.register(getModelName(EntityNamesEnum.User), {
    useValue: UserModel,
  })

  userRepository = DiContainer.resolve(UserRepository)
})

afterEach(async () => {
  DiContainer.clearInstances()
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

    it('with correct data and role "user"', async () => {
      const payload = fakeCreateUserPayload()
      const user = await userRepository.createOne(payload)

      expect(createOneUserSpy).toBeCalledTimes(1)
      expect(createOneUserSpy).toBeCalledWith(payload)
      expect(user._id).toBeInstanceOf(Types.ObjectId)
      expect(user.username).toBe(payload.username)
      expect(user.email).toBe(payload.email)
      expect(user.password).not.toBe(payload.password)
      expect(user.role).toBe(UserRoleEnum.User)
    })

    it('with correct data and role "moderator"', async () => {
      const payload = fakeCreateUserPayload(undefined, UserRoleEnum.Moderator)

      const user = await userRepository.createOne(payload)

      expect(createOneUserSpy).toBeCalledTimes(1)
      expect(createOneUserSpy).toBeCalledWith(payload)
      expect(user._id).toBeInstanceOf(Types.ObjectId)
      expect(user.username).toBe(payload.username)
      expect(user.email).toBe(payload.email)
      expect(user.password).not.toBe(payload.password)
      expect(user.role).toBe(UserRoleEnum.Moderator)
    })

    it('with incorrect data throws validation error', async () => {
      const payload = fakeCreateUserPayload('123')

      try {
        await userRepository.createOne(payload)
      } catch (error) {
        expect(createOneUserSpy).toBeCalledTimes(1)
        expect(createOneUserSpy).toBeCalledWith(payload)
        await expect(createOneUserSpy).rejects.toThrow(
          MongooseError.ValidationError,
        )
      }
    })
  })

  describe('Find one user', () => {
    let findOneUserSpy: jest.SpyInstance

    beforeEach(async () => {
      findOneUserSpy = jest.spyOn(userRepository, 'findOne')
    })

    it('by email which exists', async () => {
      const createUserPayload = fakeCreateUserPayload()
      const newUser = await userRepository.createOne(createUserPayload)

      const findOneUserFilter = { email: newUser.email }
      const user = await userRepository.findOne(findOneUserFilter)

      expect(findOneUserSpy).toBeCalledTimes(1)
      expect(findOneUserSpy).toBeCalledWith(findOneUserFilter)
      expect(user.email).toBe(findOneUserFilter.email)
    })

    it('by email which not exists', async () => {
      const findOneUserFilter = { email: getFakeEmail() }

      try {
        await userRepository.findOne(findOneUserFilter)
      } catch (error) {
        expect(findOneUserSpy).toBeCalledTimes(1)
        expect(findOneUserSpy).toBeCalledWith(findOneUserFilter)
        await expect(findOneUserSpy).rejects.toThrow(
          MongooseError.DocumentNotFoundError,
        )
      }
    })
  })

  describe('Delete one user', () => {
    let deleteOneUserSpy: jest.SpyInstance

    beforeEach(async () => {
      deleteOneUserSpy = jest.spyOn(userRepository, 'deleteOne')
    })

    it('by id which exists', async () => {
      const createUserPayload = fakeCreateUserPayload()
      const newUser = await userRepository.createOne(createUserPayload)

      const deleteOneUserFilter = { id: newUser.id }
      const deletedUser = await userRepository.deleteOne(deleteOneUserFilter)

      expect(deleteOneUserSpy).toBeCalledTimes(1)
      expect(deleteOneUserSpy).toBeCalledWith(deleteOneUserFilter)
      expect(deletedUser.id).toBe(newUser.id)
      expect(deletedUser.username).toBe(newUser.username)
      expect(deletedUser.email).toBe(newUser.email)
      expect(deletedUser.password).toBe(newUser.password)
    })

    it('by id which not exists', async () => {
      const fakeMongoId = generateMongoId()
      const deleteOneUserFilter = { id: fakeMongoId }

      try {
        await userRepository.deleteOne(deleteOneUserFilter)
      } catch (error) {
        expect(deleteOneUserSpy).toBeCalledTimes(1)
        expect(deleteOneUserSpy).toBeCalledWith(deleteOneUserFilter)
        await expect(deleteOneUserSpy).rejects.toThrow(
          MongooseError.DocumentNotFoundError,
        )
      }
    })
  })
})
