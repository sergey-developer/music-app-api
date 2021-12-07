import { internet } from 'faker'
import { container as DiContainer } from 'tsyringe'

import { fakeRepoUserPayload } from '__tests__/fakeData/user'
import { setupDB } from '__tests__/utils'
import { DatabaseNotFoundError, DatabaseValidationError } from 'database/errors'
import { UserModel } from 'database/models/user'
import generateEntityId from 'database/utils/generateEntityId'
import { DiTokenEnum } from 'lib/dependency-injection'
import { UserRoleEnum } from 'modules/user/constants'
import {
  IDeleteOneUserFilter,
  IFindOneUserFilter,
  UserRepository,
} from 'modules/user/repository'

let userRepository: UserRepository

setupDB()

beforeEach(() => {
  DiContainer.clearInstances()

  DiContainer.register(DiTokenEnum.User, {
    useValue: UserModel,
  })

  userRepository = DiContainer.resolve(UserRepository)
})

describe('User repository', () => {
  describe('Create one user', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(userRepository, 'createOne')
    })

    it('with correct data and role "user"', async () => {
      const userPayload = fakeRepoUserPayload()
      const newUser = await userRepository.createOne(userPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(userPayload)
      expect(newUser.username).toBe(userPayload.username)
      expect(newUser.email).toBe(userPayload.email)
      expect(newUser.password).not.toBe(userPayload.password)
      expect(newUser.role).toBe(userPayload.role)
    })

    it('with correct data and role "moderator"', async () => {
      const userPayload = fakeRepoUserPayload({
        role: UserRoleEnum.Moderator,
      })

      const newUser = await userRepository.createOne(userPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(userPayload)
      expect(newUser.username).toBe(userPayload.username)
      expect(newUser.email).toBe(userPayload.email)
      expect(newUser.password).not.toBe(userPayload.password)
      expect(newUser.role).toBe(userPayload.role)
    })

    it('with incorrect data and throw validation error', async () => {
      const userPayload = fakeRepoUserPayload(null, {
        isIncorrect: true,
      })

      try {
        const newUser = await userRepository.createOne(userPayload)
        expect(newUser).not.toBeDefined()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(userPayload)
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
        expect(user).not.toBeDefined()
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
      const filter: IDeleteOneUserFilter = { id: generateEntityId() }

      try {
        const deletedUser = await userRepository.deleteOne(filter)
        expect(deletedUser).not.toBeDefined()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })
})
