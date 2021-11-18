import { container as DiContainer } from 'tsyringe'

import { getRandomString } from '__tests__/fakeData/common'
import { fakeCreateSessionPayload } from '__tests__/fakeData/session'
import { setupDB } from '__tests__/utils'
import EntityNamesEnum from 'database/constants/entityNamesEnum'
import getModelName from 'database/utils/getModelName'
import { SessionModel } from 'modules/session/model'
import { SessionService } from 'modules/session/service'
import {
  isBadRequestError,
  isNotFoundError,
} from 'shared/utils/errors/httpErrors'

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
      const sessionPayload = fakeCreateSessionPayload()
      const newSession = await sessionService.createOne(sessionPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(sessionPayload)
      expect(typeof newSession.id).toBe('string')
      expect(newSession.id).toBeTruthy()
      expect(typeof newSession.token).toBe('string')
      expect(newSession.token).toBeTruthy()
      expect(newSession.user.toString()).toBe(sessionPayload.userId)
    })

    it('with incorrect data throws bad request error', async () => {
      const sessionPayload = {
        ...fakeCreateSessionPayload(),
        userId: getRandomString(),
      }

      try {
        const newSession = await sessionService.createOne(sessionPayload)
        expect(newSession).not.toBeDefined()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(sessionPayload)
        expect(isBadRequestError(error)).toBe(true)
      }
    })
  })

  describe('Get one session by token', () => {
    let getOneByTokenSpy: jest.SpyInstance

    beforeEach(() => {
      getOneByTokenSpy = jest.spyOn(sessionService, 'getOneByToken')
    })

    it('which exists', async () => {
      const sessionPayload = fakeCreateSessionPayload()
      const newSession = await sessionService.createOne(sessionPayload)
      const session = await sessionService.getOneByToken(newSession.token)

      expect(getOneByTokenSpy).toBeCalledTimes(1)
      expect(getOneByTokenSpy).toBeCalledWith(newSession.token)
      expect(session.id).toBe(newSession.id)
      expect(session.token).toBe(newSession.token)
      expect(session.user).toEqual(newSession.user)
    })

    it('which not exist and throw not found error', async () => {
      const incorrectToken = getRandomString()

      try {
        const session = await sessionService.getOneByToken(incorrectToken)
        expect(session).not.toBeDefined()
      } catch (error) {
        expect(getOneByTokenSpy).toBeCalledTimes(1)
        expect(getOneByTokenSpy).toBeCalledWith(incorrectToken)
        expect(isNotFoundError(error)).toBe(true)
      }
    })
  })

  describe('Delete one session by token', () => {
    let deleteOneByTokenSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneByTokenSpy = jest.spyOn(sessionService, 'deleteOneByToken')
    })

    it('which exists', async () => {
      const sessionPayload = fakeCreateSessionPayload()
      const newSession = await sessionService.createOne(sessionPayload)
      const deletedSession = await sessionService.deleteOneByToken(
        newSession.token,
      )

      expect(deleteOneByTokenSpy).toBeCalledTimes(1)
      expect(deleteOneByTokenSpy).toBeCalledWith(newSession.token)
      expect(deletedSession.id).toBe(newSession.id)
      expect(deletedSession.token).toBe(newSession.token)
      expect(deletedSession.user).toEqual(newSession.user)
    })

    it('which not exist and throw not found error', async () => {
      const tokenWhichNotExists = getRandomString()

      try {
        const deletedSession = await sessionService.deleteOneByToken(
          tokenWhichNotExists,
        )

        expect(deletedSession).not.toBeDefined()
      } catch (error) {
        expect(deleteOneByTokenSpy).toBeCalledTimes(1)
        expect(deleteOneByTokenSpy).toBeCalledWith(tokenWhichNotExists)
        expect(isNotFoundError(error)).toBe(true)
      }
    })
  })
})
