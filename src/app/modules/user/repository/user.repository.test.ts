import { internet } from 'faker'
import { container as DiContainer } from 'tsyringe'

import { fakeRepoUserPayload } from '__tests__/fakeData/user'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { DatabaseNotFoundError, DatabaseValidationError } from 'database/errors'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import { UserRoleEnum } from 'modules/user/constants'
import {
  IDeleteOneUserFilter,
  IFindOneUserFilter,
  UserRepository,
} from 'modules/user/repository'

let userRepository: UserRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.User)
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
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(userRepository, 'createOne')
    })

    it('with correct data and role "user" created successfully', async () => {
      const creationPayload = fakeRepoUserPayload()
      const newUser = await userRepository.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newUser.id).toBeTruthy()
      expect(newUser.username).toBe(creationPayload.username)
      expect(newUser.email).toBe(creationPayload.email)
      expect(newUser.password).not.toBe(creationPayload.password)
      expect(newUser.role).toBe(creationPayload.role)
    })

    it('with correct data and role "moderator" created successfully', async () => {
      const creationPayload = fakeRepoUserPayload({
        role: UserRoleEnum.Moderator,
      })

      const newUser = await userRepository.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newUser.id).toBeTruthy()
      expect(newUser.username).toBe(creationPayload.username)
      expect(newUser.email).toBe(creationPayload.email)
      expect(newUser.password).not.toBe(creationPayload.password)
      expect(newUser.role).toBe(creationPayload.role)
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeRepoUserPayload(null, {
        isIncorrect: true,
      })

      try {
        const newUser = await userRepository.createOne(creationPayload)
        expect(newUser).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(creationPayload)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })
  })

  describe('Find one user', () => {
    let findOneSpy: jest.SpyInstance

    beforeEach(async () => {
      findOneSpy = jest.spyOn(userRepository, 'findOne')
    })

    it('by email which exists', async () => {
      const newUser = await userRepository.createOne(fakeRepoUserPayload())

      const filter: IFindOneUserFilter = { email: newUser.email }
      const user = await userRepository.findOne(filter)

      expect(findOneSpy).toBeCalledTimes(1)
      expect(findOneSpy).toBeCalledWith(filter)
      expect(user.id).toBe(newUser.id)
      expect(user.username).toBe(newUser.username)
      expect(user.email).toBe(newUser.email)
      expect(user.password).toBe(newUser.password)
      expect(user.role).toBe(newUser.role)
    })

    it('by email which not exist and throw not found error', async () => {
      const filter: IFindOneUserFilter = { email: internet.email() }

      try {
        const user = await userRepository.findOne(filter)
        expect(user).not.toBeTruthy()
      } catch (error) {
        expect(findOneSpy).toBeCalledTimes(1)
        expect(findOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })

  describe('Delete one user', () => {
    let deleteOneSpy: jest.SpyInstance

    beforeEach(async () => {
      deleteOneSpy = jest.spyOn(userRepository, 'deleteOne')
    })

    it('by id which exists', async () => {
      const newUser = await userRepository.createOne(fakeRepoUserPayload())

      const filter: IDeleteOneUserFilter = { id: newUser.id }
      const deletedUser = await userRepository.deleteOne(filter)

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(filter)
      expect(deletedUser.id).toBe(newUser.id)
      expect(deletedUser.username).toBe(newUser.username)
      expect(deletedUser.email).toBe(newUser.email)
      expect(deletedUser.password).toBe(newUser.password)
      expect(deletedUser.role).toBe(newUser.role)
    })

    it('by id which not exist and throw not found error', async () => {
      const filter: IDeleteOneUserFilter = { id: fakeEntityId() }

      try {
        const deletedUser = await userRepository.deleteOne(filter)
        expect(deletedUser).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })
})
