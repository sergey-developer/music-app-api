import faker from 'faker'
import { Error as MongooseError, Types } from 'mongoose'
import { container } from 'tsyringe'

import { EntityNamesEnum } from 'database/constants/entityNames'
import * as db from 'database/utils/db'
import getModelName from 'database/utils/getModelName'
import { MIN_LENGTH_PASSWORD, UserRoleEnum } from 'modules/user/constants'
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
        username: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(MIN_LENGTH_PASSWORD),
      }

      const user = await userRepository.createOne(payload)

      expect(createOneUserSpy).toBeCalledTimes(1)
      expect(createOneUserSpy).toBeCalledWith(payload)
      expect(user._id).toBeInstanceOf(Types.ObjectId)
      expect(user.username).toBe(payload.username)
      expect(user.email).toBe(payload.email)
      expect(user.password).not.toBe(payload.password)
      expect(user.role).toBe(UserRoleEnum.User)
    })

    it('with role "moderator"', async () => {
      const payload: ICreateUserPayload = {
        username: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(MIN_LENGTH_PASSWORD),
        role: UserRoleEnum.Moderator,
      }

      const user = await userRepository.createOne(payload)

      expect(createOneUserSpy).toBeCalledTimes(1)
      expect(createOneUserSpy).toBeCalledWith(payload)
      expect(user._id).toBeInstanceOf(Types.ObjectId)
      expect(user.username).toBe(payload.username)
      expect(user.email).toBe(payload.email)
      expect(user.password).not.toBe(payload.password)
      expect(user.role).toBe(UserRoleEnum.Moderator)
    })

    it('with invalid data throws validation error', async () => {
      const payload: ICreateUserPayload = {
        username: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(MIN_LENGTH_PASSWORD),
      }

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
      const newUser = await userRepository.createOne({
        username: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(MIN_LENGTH_PASSWORD),
      })

      const findOneUserFilter = {
        email: newUser.email,
      }
      const user = await userRepository.findOne(findOneUserFilter)

      expect(findOneUserSpy).toBeCalledTimes(1)
      expect(findOneUserSpy).toBeCalledWith(findOneUserFilter)
      expect(user.email).toBe(findOneUserFilter.email)
    })

    it('by email which not exists', async () => {
      const findOneUserFilter = {
        email: faker.internet.email(),
      }

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
    let createOneUserSpy: jest.SpyInstance
    let deleteOneUserSpy: jest.SpyInstance

    beforeEach(async () => {
      createOneUserSpy = jest.spyOn(userRepository, 'createOne')
      deleteOneUserSpy = jest.spyOn(userRepository, 'deleteOne')
    })

    it('by id which exists', async () => {
      const createUserPayload: ICreateUserPayload = {
        username: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(MIN_LENGTH_PASSWORD),
      }
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
      const fakeMongoId = '6183982cdb7a2f951e5efd8b'
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
