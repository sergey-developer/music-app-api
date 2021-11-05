import { container as DiContainer } from 'tsyringe'

import { fakeCreateSessionPayload } from '__tests__/fakeData/session'
import { setupDB } from '__tests__/utils'
import { EntityNamesEnum } from 'database/constants/entityNames'
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
      const payload = fakeCreateSessionPayload()
      const session = await sessionService.createOne(payload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(payload)
      expect(typeof session.id).toBe('string')
      expect(session.id).toBeTruthy()
      expect(typeof session.token).toBe('string')
      expect(session.token).toBeTruthy()
      expect(session.user.toString()).toBe(payload.userId)
    })

    it('with incorrect data throws bad request error', async () => {
      const payload = {
        ...fakeCreateSessionPayload(),
        userId: 'incorrectUserId',
      }

      try {
        const session = await sessionService.createOne(payload)
        expect(session).not.toBeDefined()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(payload)
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
      const createSessionPayload = fakeCreateSessionPayload()
      const newSession = await sessionService.createOne(createSessionPayload)
      const session = await sessionService.getOneByToken(newSession.token)

      expect(getOneByTokenSpy).toBeCalledTimes(1)
      expect(getOneByTokenSpy).toBeCalledWith(newSession.token)
      expect(session.id).toBe(newSession.id)
      expect(session.token).toBe(newSession.token)
      expect(session.user).toEqual(newSession.user)
    })

    it('which not exist and throw not found error', async () => {
      const incorrectToken = 'tokenWhichNotExists'

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
      const createSessionPayload = fakeCreateSessionPayload()
      const newSession = await sessionService.createOne(createSessionPayload)
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
      const tokenWhichNotExists = 'tokenWhichNotExists'

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
