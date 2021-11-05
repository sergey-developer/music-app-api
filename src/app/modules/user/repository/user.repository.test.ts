import { Error as MongooseError } from 'mongoose'
import { container as DiContainer } from 'tsyringe'

import { getFakeEmail } from '__tests__/fakeData/common'
import { fakeCreateUserPayload } from '__tests__/fakeData/user'
import { setupDB } from '__tests__/utils'
import { EntityNamesEnum } from 'database/constants/entityNames'
import generateMongoId from 'database/utils/generateMongoId'
import getModelName from 'database/utils/getModelName'
import { UserRoleEnum } from 'modules/user/constants'
import { UserModel } from 'modules/user/model'
import { UserRepository } from 'modules/user/repository'

let userRepository: UserRepository

setupDB()

beforeEach(() => {
  DiContainer.clearInstances()
  DiContainer.register(getModelName(EntityNamesEnum.User), {
    useValue: UserModel,
  })

  userRepository = DiContainer.resolve(UserRepository)
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
      expect(typeof user.id).toBe('string')
      expect(user.id).toBeTruthy()
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
      expect(typeof user.id).toBe('string')
      expect(user.id).toBeTruthy()
      expect(user.username).toBe(payload.username)
      expect(user.email).toBe(payload.email)
      expect(user.password).not.toBe(payload.password)
      expect(user.role).toBe(UserRoleEnum.Moderator)
    })

    it('with incorrect data throws validation error', async () => {
      const payload = fakeCreateUserPayload('123')

      try {
        const user = await userRepository.createOne(payload)
        expect(user).not.toBeDefined()
      } catch (error) {
        expect(createOneUserSpy).toBeCalledTimes(1)
        expect(createOneUserSpy).toBeCalledWith(payload)
        expect(error).toBeInstanceOf(MongooseError.ValidationError)
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

    it('by email which not exist and throw not found error', async () => {
      const findOneUserFilter = { email: getFakeEmail() }

      try {
        const user = await userRepository.findOne(findOneUserFilter)
        expect(user).not.toBeDefined()
      } catch (error) {
        expect(findOneUserSpy).toBeCalledTimes(1)
        expect(findOneUserSpy).toBeCalledWith(findOneUserFilter)
        expect(error).toBeInstanceOf(MongooseError.DocumentNotFoundError)
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
      expect(deletedUser.role).toBe(newUser.role)
    })

    it('by id which not exist and throw not found error', async () => {
      const deleteOneUserFilter = { id: generateMongoId() }

      try {
        const user = await userRepository.deleteOne(deleteOneUserFilter)
        expect(user).not.toBeDefined()
      } catch (error) {
        expect(deleteOneUserSpy).toBeCalledTimes(1)
        expect(deleteOneUserSpy).toBeCalledWith(deleteOneUserFilter)
        expect(error).toBeInstanceOf(MongooseError.DocumentNotFoundError)
      }
    })
  })
})
