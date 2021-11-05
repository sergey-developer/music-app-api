import { container as DiContainer } from 'tsyringe'

import { getFakeEmail } from '__tests__/fakeData/common'
import { fakeCreateUserPayload } from '__tests__/fakeData/user'
import { setupDB } from '__tests__/utils'
import { EntityNamesEnum } from 'database/constants/entityNames'
import generateMongoId from 'database/utils/generateMongoId'
import getModelName from 'database/utils/getModelName'
import { UserRoleEnum } from 'modules/user/constants'
import { UserModel } from 'modules/user/model'
import { UserService } from 'modules/user/service'
import {
  isBadRequestError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'

let userService: UserService

setupDB()

beforeEach(() => {
  DiContainer.clearInstances()
  DiContainer.register(getModelName(EntityNamesEnum.User), {
    useValue: UserModel,
  })

  userService = DiContainer.resolve(UserService)
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
      expect(typeof user.id).toBe('string')
      expect(user.id).toBeTruthy()
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
      expect(deletedUser.id).toBe(newUser.id)
      expect(deletedUser.username).toBe(newUser.username)
      expect(deletedUser.password).toBe(newUser.password)
      expect(deletedUser.email).toBe(newUser.email)
      expect(deletedUser.role).toBe(newUser.role)
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
