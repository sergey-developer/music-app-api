import { Error as MongooseError, Types } from 'mongoose'
import { container as DiContainer } from 'tsyringe'

import { fakeJwtPayload } from '__tests__/fakeData/session'
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
  describe('Find one session', () => {
    let findOneSessionSpy: jest.SpyInstance

    beforeEach(() => {
      findOneSessionSpy = jest.spyOn(sessionRepository, 'findOne')
    })

    it('by token which exists', async () => {
      const createSessionPayload = fakeJwtPayload()
      const newSession = await sessionRepository.createOne(createSessionPayload)

      const findOneSessionFilter = { token: newSession.token }
      const session = await sessionRepository.findOne(findOneSessionFilter)

      expect(findOneSessionSpy).toBeCalledTimes(1)
      expect(findOneSessionSpy).toBeCalledWith(findOneSessionFilter)
      expect(session.id).toBe(newSession.id)
      expect(session.token).toBe(newSession.token)
      expect(session.user).toEqual(newSession.user)
    })

    it('by token which not exists', async () => {
      const findOneSessionFilter = { token: '123' }

      try {
        const session = await sessionRepository.findOne(findOneSessionFilter)
        expect(session).not.toBeDefined()
      } catch (error) {
        expect(findOneSessionSpy).toBeCalledTimes(1)
        expect(findOneSessionSpy).toBeCalledWith(findOneSessionFilter)
        await expect(findOneSessionSpy).rejects.toThrow(
          MongooseError.DocumentNotFoundError,
        )
      }
    })
  })

  describe('Create one session', () => {
    let createOneSessionSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSessionSpy = jest.spyOn(sessionRepository, 'createOne')
    })

    it('with correct data', async () => {
      const payload = fakeJwtPayload()
      const session = await sessionRepository.createOne(payload)

      expect(createOneSessionSpy).toBeCalledTimes(1)
      expect(createOneSessionSpy).toBeCalledWith(payload)
      expect(typeof session.id).toBe('string')
      expect(session.id).toBeTruthy()
      expect(typeof session.token).toBe('string')
      expect(session.token).toBeTruthy()
      expect(session.user).toBeInstanceOf(Types.ObjectId)
    })

    it('with incorrect data throws validation error', async () => {
      const payload = {
        ...fakeJwtPayload(),
        userId: 'notCorrectUserId',
      }

      try {
        const session = await sessionRepository.createOne(payload)
        expect(session).not.toBeDefined()
      } catch (error) {
        expect(createOneSessionSpy).toBeCalledTimes(1)
        expect(createOneSessionSpy).toBeCalledWith(payload)
        expect(error).toBeInstanceOf(MongooseError.ValidationError)
      }
    })
  })

  describe('Delete one session', () => {
    let deleteOneSessionSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneSessionSpy = jest.spyOn(sessionRepository, 'deleteOne')
    })

    it('by token which exists', async () => {
      const createSessionPayload = fakeJwtPayload()
      const newSession = await sessionRepository.createOne(createSessionPayload)

      const deleteOneSessionFilter = { token: newSession.token }
      const deletedSession = await sessionRepository.deleteOne(
        deleteOneSessionFilter,
      )

      expect(deleteOneSessionSpy).toBeCalledTimes(1)
      expect(deleteOneSessionSpy).toBeCalledWith(deleteOneSessionFilter)
      expect(deletedSession.id).toBe(newSession.id)
      expect(deletedSession.token).toBe(newSession.token)
      expect(deletedSession.user).toEqual(newSession.user)
    })

    it('by token which not exists', async () => {
      const deleteOneSessionFilter = { token: 'tokenWhichNotExist' }

      try {
        const deletedSession = await sessionRepository.deleteOne(
          deleteOneSessionFilter,
        )

        expect(deletedSession).not.toBeDefined()
      } catch (error) {
        expect(deleteOneSessionSpy).toBeCalledTimes(1)
        expect(deleteOneSessionSpy).toBeCalledWith(deleteOneSessionFilter)
        await expect(deleteOneSessionSpy).rejects.toThrow(
          MongooseError.DocumentNotFoundError,
        )
      }
    })
  })
})
