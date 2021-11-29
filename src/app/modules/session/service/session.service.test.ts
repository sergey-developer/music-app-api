import { datatype } from 'faker'
import { container as DiContainer } from 'tsyringe'

import { fakeServiceSessionPayload } from '__tests__/fakeData/session'
import { setupDB } from '__tests__/utils'
import EntityNamesEnum from 'database/constants/entityNamesEnum'
import getModelName from 'database/utils/getModelName'
import { SessionModel } from 'modules/session/model'
import { SessionService } from 'modules/session/service'
import {
  AppNotFoundError,
  AppValidationError,
} from 'shared/utils/errors/appErrors'

let sessionService: SessionService

setupDB()

beforeEach(() => {
  DiContainer.clearInstances()

  DiContainer.register(getModelName(EntityNamesEnum.Session), {
    useValue: SessionModel,
  })

  sessionService = DiContainer.resolve(SessionService)
})

describe('Session service', () => {
  describe('Create one session', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(sessionService, 'createOne')
    })

    it('with correct data', async () => {
      const sessionPayload = fakeServiceSessionPayload()
      const newSession = await sessionService.createOne(sessionPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(sessionPayload)
      expect(newSession).toBeDefined()
    })

    it('with incorrect data throw validation error', async () => {
      const sessionPayload = fakeServiceSessionPayload({ isIncorrect: true })

      try {
        const newSession = await sessionService.createOne(sessionPayload)
        expect(newSession).not.toBeDefined()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(sessionPayload)
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
      expect(session).toBeDefined()
    })

    it('which not exist and throw not found error', async () => {
      const token = datatype.string()

      try {
        const session = await sessionService.getOneByToken(token)
        expect(session).not.toBeDefined()
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
      expect(deletedSession).toBeDefined()
    })

    it('which not exist and throw not found error', async () => {
      const token = datatype.string()

      try {
        const deletedSession = await sessionService.deleteOneByToken(token)
        expect(deletedSession).not.toBeDefined()
      } catch (error) {
        expect(deleteOneByTokenSpy).toBeCalledTimes(1)
        expect(deleteOneByTokenSpy).toBeCalledWith(token)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })
})
