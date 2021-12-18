import { datatype } from 'faker'
import { container as DiContainer } from 'tsyringe'

import { fakeServiceSessionPayload } from '__tests__/fakeData/session'
import {
  AppNotFoundError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import { SessionService } from 'modules/session/service'

let sessionService: SessionService

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.Session)
  sessionService = DiContainer.resolve(SessionService)
})

afterEach(async () => {
  DiContainer.clearInstances()
  await db.clear()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('Session service', () => {
  describe('Create one session', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(sessionService, 'createOne')
    })

    it('with correct data  created successfully', async () => {
      const creationPayload = fakeServiceSessionPayload()
      const newSession = await sessionService.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newSession).toBeTruthy()
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeServiceSessionPayload({ isIncorrect: true })

      try {
        const newSession = await sessionService.createOne(creationPayload)
        expect(newSession).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(creationPayload)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })
  })

  describe('Get one session by token', () => {
    let getOneByTokenSpy: jest.SpyInstance

    beforeEach(() => {
      getOneByTokenSpy = jest.spyOn(sessionService, 'getOneByToken')
    })

    it('which exists', async () => {
      const newSession = await sessionService.createOne(
        fakeServiceSessionPayload(),
      )
      const session = await sessionService.getOneByToken(newSession.token)

      expect(getOneByTokenSpy).toBeCalledTimes(1)
      expect(getOneByTokenSpy).toBeCalledWith(newSession.token)
      expect(session).toBeTruthy()
    })

    it('which not exist and throw not found error', async () => {
      const token = datatype.string()

      try {
        const session = await sessionService.getOneByToken(token)
        expect(session).not.toBeTruthy()
      } catch (error) {
        expect(getOneByTokenSpy).toBeCalledTimes(1)
        expect(getOneByTokenSpy).toBeCalledWith(token)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })

  describe('Delete one session by token', () => {
    let deleteOneByTokenSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneByTokenSpy = jest.spyOn(sessionService, 'deleteOneByToken')
    })

    it('which exists', async () => {
      const newSession = await sessionService.createOne(
        fakeServiceSessionPayload(),
      )
      const deletedSession = await sessionService.deleteOneByToken(
        newSession.token,
      )

      expect(deleteOneByTokenSpy).toBeCalledTimes(1)
      expect(deleteOneByTokenSpy).toBeCalledWith(newSession.token)
      expect(deletedSession).toBeTruthy()
    })

    it('which not exist and throw not found error', async () => {
      const token = datatype.string()

      try {
        const deletedSession = await sessionService.deleteOneByToken(token)
        expect(deletedSession).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneByTokenSpy).toBeCalledTimes(1)
        expect(deleteOneByTokenSpy).toBeCalledWith(token)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })
})
