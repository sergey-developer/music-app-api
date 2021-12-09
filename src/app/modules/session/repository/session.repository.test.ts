import { datatype } from 'faker'
import { container as DiContainer } from 'tsyringe'

import { fakeRepoSessionPayload } from '__tests__/fakeData/session'
import { DatabaseNotFoundError, DatabaseValidationError } from 'database/errors'
import { SessionModel } from 'database/models/session'
import * as db from 'database/utils/db'
import { DiTokenEnum } from 'lib/dependency-injection'
import {
  IDeleteOneSessionFilter,
  IFindOneSessionFilter,
  SessionRepository,
} from 'modules/session/repository'

let sessionRepository: SessionRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  DiContainer.register(DiTokenEnum.Session, {
    useValue: SessionModel,
  })

  sessionRepository = DiContainer.resolve(SessionRepository)
})

afterEach(async () => {
  DiContainer.clearInstances()
  await db.clear()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('Session repository', () => {
  describe('Create one session', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(sessionRepository, 'createOne')
    })

    it('with correct data', async () => {
      const sessionPayload = fakeRepoSessionPayload()
      const newSession = await sessionRepository.createOne(sessionPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(sessionPayload)
      expect(newSession.token).toBeTruthy()
      expect(newSession.user.toString()).toBe(sessionPayload.userId)
    })

    it('with incorrect data and throw validation error', async () => {
      const sessionPayload = fakeRepoSessionPayload({ isIncorrect: true })

      try {
        const newSession = await sessionRepository.createOne(sessionPayload)
        expect(newSession).not.toBeDefined()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(sessionPayload)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })
  })

  describe('Find one session', () => {
    let findOneSpy: jest.SpyInstance

    beforeEach(() => {
      findOneSpy = jest.spyOn(sessionRepository, 'findOne')
    })

    it('by token which exists', async () => {
      const newSession = await sessionRepository.createOne(
        fakeRepoSessionPayload(),
      )

      const filter: IFindOneSessionFilter = { token: newSession.token }
      const session = await sessionRepository.findOne(filter)

      expect(findOneSpy).toBeCalledTimes(1)
      expect(findOneSpy).toBeCalledWith(filter)
      expect(session.id).toBe(newSession.id)
      expect(session.token).toBe(newSession.token)
      expect(session.user.toString()).toBe(newSession.user.toString())
    })

    it('by token which not exist and throw not found error', async () => {
      const filter: IFindOneSessionFilter = { token: datatype.string() }

      try {
        const session = await sessionRepository.findOne(filter)
        expect(session).not.toBeDefined()
      } catch (error) {
        expect(findOneSpy).toBeCalledTimes(1)
        expect(findOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })

  describe('Delete one session', () => {
    let deleteOneSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneSpy = jest.spyOn(sessionRepository, 'deleteOne')
    })

    it('by token which exists', async () => {
      const newSession = await sessionRepository.createOne(
        fakeRepoSessionPayload(),
      )

      const filter: IDeleteOneSessionFilter = { token: newSession.token }
      const deletedSession = await sessionRepository.deleteOne(filter)

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(filter)
      expect(deletedSession.id).toBe(newSession.id)
      expect(deletedSession.token).toBe(newSession.token)
      expect(deletedSession.user.toString()).toBe(newSession.user.toString())
    })

    it('by token which not exist and throw not found error', async () => {
      const filter: IDeleteOneSessionFilter = { token: datatype.string() }

      try {
        const deletedSession = await sessionRepository.deleteOne(filter)
        expect(deletedSession).not.toBeDefined()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })
})
