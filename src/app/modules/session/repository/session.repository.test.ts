import { container as DiContainer } from 'tsyringe'

import { getRandomString } from '__tests__/fakeData/common'
import { fakeCreateSessionPayload } from '__tests__/fakeData/session'
import { setupDB } from '__tests__/utils'
import { EntityNamesEnum } from 'database/constants/entityNames'
import getModelName from 'database/utils/getModelName'
import { SessionModel } from 'modules/session/model'
import { SessionRepository } from 'modules/session/repository'

let sessionRepository: SessionRepository

setupDB()

beforeEach(() => {
  DiContainer.clearInstances()
  DiContainer.register(getModelName(EntityNamesEnum.Session), {
    useValue: SessionModel,
  })

  sessionRepository = DiContainer.resolve(SessionRepository)
})

describe('Session repository', () => {
  describe('Create one session', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(sessionRepository, 'createOne')
    })

    it('with correct data', async () => {
      const sessionPayload = fakeCreateSessionPayload()
      const newSession = await sessionRepository.createOne(sessionPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(sessionPayload)
      expect(typeof newSession.id).toBe('string')
      expect(newSession.id).toBeTruthy()
      expect(typeof newSession.token).toBe('string')
      expect(newSession.token).toBeTruthy()
      expect(newSession.user.toString()).toBe(sessionPayload.userId)
    })

    it('with incorrect data throws error', async () => {
      const sessionPayload = {
        ...fakeCreateSessionPayload(),
        userId: getRandomString(),
      }

      try {
        const newSession = await sessionRepository.createOne(sessionPayload)
        expect(newSession).not.toBeDefined()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(sessionPayload)
        expect(error).toBeDefined()
      }
    })
  })

  describe('Find one session', () => {
    let findOneSpy: jest.SpyInstance

    beforeEach(() => {
      findOneSpy = jest.spyOn(sessionRepository, 'findOne')
    })

    it('by token which exists', async () => {
      const sessionPayload = fakeCreateSessionPayload()
      const newSession = await sessionRepository.createOne(sessionPayload)

      const findOneSessionFilter = { token: newSession.token }
      const session = await sessionRepository.findOne(findOneSessionFilter)

      expect(findOneSpy).toBeCalledTimes(1)
      expect(findOneSpy).toBeCalledWith(findOneSessionFilter)
      expect(session.id).toBe(newSession.id)
      expect(session.token).toBe(newSession.token)
      expect(session.user).toEqual(newSession.user)
    })

    it('by token which not exist and throws error', async () => {
      const findOneSessionFilter = { token: getRandomString() }

      try {
        const session = await sessionRepository.findOne(findOneSessionFilter)
        expect(session).not.toBeDefined()
      } catch (error) {
        expect(findOneSpy).toBeCalledTimes(1)
        expect(findOneSpy).toBeCalledWith(findOneSessionFilter)
        expect(error).toBeDefined()
      }
    })
  })

  describe('Delete one session', () => {
    let deleteOneSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneSpy = jest.spyOn(sessionRepository, 'deleteOne')
    })

    it('by token which exists', async () => {
      const sessionPayload = fakeCreateSessionPayload()
      const newSession = await sessionRepository.createOne(sessionPayload)

      const deleteOneSessionFilter = { token: newSession.token }
      const deletedSession = await sessionRepository.deleteOne(
        deleteOneSessionFilter,
      )

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(deleteOneSessionFilter)
      expect(deletedSession.id).toBe(newSession.id)
      expect(deletedSession.token).toBe(newSession.token)
      expect(deletedSession.user).toEqual(newSession.user)
    })

    it('by token which not exist and throws error', async () => {
      const deleteOneSessionFilter = { token: getRandomString() }

      try {
        const deletedSession = await sessionRepository.deleteOne(
          deleteOneSessionFilter,
        )

        expect(deletedSession).not.toBeDefined()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(deleteOneSessionFilter)
        expect(error).toBeDefined()
      }
    })
  })
})
