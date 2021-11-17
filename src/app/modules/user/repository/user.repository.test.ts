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
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(userRepository, 'createOne')
    })

    it('with correct data and role "user"', async () => {
      const userPayload = fakeCreateUserPayload()
      const newUser = await userRepository.createOne(userPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(userPayload)
      expect(typeof newUser.id).toBe('string')
      expect(newUser.id).toBeTruthy()
      expect(newUser.username).toBe(userPayload.username)
      expect(newUser.email).toBe(userPayload.email)
      expect(newUser.password).not.toBe(userPayload.password)
      expect(newUser.role).toBe(UserRoleEnum.User)
    })

    it('with correct data and role "moderator"', async () => {
      const userPayload = fakeCreateUserPayload(UserRoleEnum.Moderator)

      const newUser = await userRepository.createOne(userPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(userPayload)
      expect(typeof newUser.id).toBe('string')
      expect(newUser.id).toBeTruthy()
      expect(newUser.username).toBe(userPayload.username)
      expect(newUser.email).toBe(userPayload.email)
      expect(newUser.password).not.toBe(userPayload.password)
      expect(newUser.role).toBe(UserRoleEnum.Moderator)
    })

    it('with incorrect data throws error', async () => {
      const userPayload = fakeCreateUserPayload(null, {
        isIncorrect: true,
      })

      try {
        const newUser = await userRepository.createOne(userPayload)
        expect(newUser).not.toBeDefined()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(userPayload)
        expect(error).toBeDefined()
      }
    })
  })

  describe('Find one user', () => {
    let findOneSpy: jest.SpyInstance

    beforeEach(async () => {
      findOneSpy = jest.spyOn(userRepository, 'findOne')
    })

    it('by email which exists', async () => {
      const userPayload = fakeCreateUserPayload()
      const newUser = await userRepository.createOne(userPayload)

      const findOneUserFilter = { email: newUser.email }
      const user = await userRepository.findOne(findOneUserFilter)

      expect(findOneSpy).toBeCalledTimes(1)
      expect(findOneSpy).toBeCalledWith(findOneUserFilter)
      expect(user.email).toBe(findOneUserFilter.email)
    })

    it('by email which not exist and throws error', async () => {
      const findOneUserFilter = { email: getFakeEmail() }

      try {
        const user = await userRepository.findOne(findOneUserFilter)
        expect(user).not.toBeDefined()
      } catch (error) {
        expect(findOneSpy).toBeCalledTimes(1)
        expect(findOneSpy).toBeCalledWith(findOneUserFilter)
        expect(error).toBeDefined()
      }
    })
  })

  describe('Delete one user', () => {
    let deleteOneSpy: jest.SpyInstance

    beforeEach(async () => {
      deleteOneSpy = jest.spyOn(userRepository, 'deleteOne')
    })

    it('by id which exists', async () => {
      const userPayload = fakeCreateUserPayload()
      const newUser = await userRepository.createOne(userPayload)

      const deleteOneUserFilter = { id: newUser.id }
      const deletedUser = await userRepository.deleteOne(deleteOneUserFilter)

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(deleteOneUserFilter)
      expect(deletedUser.id).toBe(newUser.id)
      expect(deletedUser.username).toBe(newUser.username)
      expect(deletedUser.email).toBe(newUser.email)
      expect(deletedUser.password).toBe(newUser.password)
      expect(deletedUser.role).toBe(newUser.role)
    })

    it('by id which not exist and throws error', async () => {
      const deleteOneUserFilter = { id: generateMongoId() }

      try {
        const deletedUser = await userRepository.deleteOne(deleteOneUserFilter)
        expect(deletedUser).not.toBeDefined()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(deleteOneUserFilter)
        expect(error).toBeDefined()
      }
    })
  })
})
