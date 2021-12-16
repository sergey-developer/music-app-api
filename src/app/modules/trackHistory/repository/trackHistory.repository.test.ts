import { container as DiContainer } from 'tsyringe'

import { fakeRepoTrackHistoryPayload } from '__tests__/fakeData/trackHistory'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { DatabaseNotFoundError, DatabaseValidationError } from 'database/errors'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import {
  IDeleteManyTrackHistoryFilter,
  IDeleteOneTrackHistoryFilter,
  IFindAllTrackHistoryFilter,
  TrackHistoryRepository,
} from 'modules/trackHistory/repository'

let trackHistoryRepository: TrackHistoryRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.TrackHistory)
  registerModel(DiTokenEnum.Track)

  trackHistoryRepository = DiContainer.resolve(TrackHistoryRepository)
})

afterEach(async () => {
  DiContainer.clearInstances()
  await db.clear()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('Track history repository', () => {
  describe('Create one track history', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(trackHistoryRepository, 'createOne')
    })

    it('with correct data created successfully', async () => {
      const creationPayload = fakeRepoTrackHistoryPayload()
      const newTrackHistory = await trackHistoryRepository.createOne(
        creationPayload,
      )

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newTrackHistory.id).toBeTruthy()
      expect(newTrackHistory.user.toString()).toBe(creationPayload.user)
      expect(newTrackHistory.listenDate).toBe(creationPayload.listenDate)
      expect(newTrackHistory.populated('track').toString()).toBe(
        creationPayload.track,
      )
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeRepoTrackHistoryPayload(null, {
        isIncorrect: true,
      })

      try {
        const newTrackHistory = await trackHistoryRepository.createOne(
          creationPayload,
        )

        expect(newTrackHistory).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(creationPayload)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })
  })

  describe('Find all track histories', () => {
    let findAllWhereSpy: jest.SpyInstance

    beforeEach(() => {
      findAllWhereSpy = jest.spyOn(trackHistoryRepository, 'findAllWhere')
    })

    it('with empty filter', async () => {
      await trackHistoryRepository.createOne(fakeRepoTrackHistoryPayload())
      await trackHistoryRepository.createOne(fakeRepoTrackHistoryPayload())

      const filter = {}
      const trackHistories = await trackHistoryRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(trackHistories)).toBe(true)
      expect(trackHistories).toHaveLength(2)
    })

    it('by user which has track histories', async () => {
      const creationPayload1 = fakeRepoTrackHistoryPayload()
      const creationPayload2 = fakeRepoTrackHistoryPayload()

      await trackHistoryRepository.createOne(creationPayload1)
      await trackHistoryRepository.createOne(creationPayload2)

      const filter: IFindAllTrackHistoryFilter = {
        user: creationPayload1.user,
      }
      const trackHistories = await trackHistoryRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(trackHistories)).toBe(true)
      expect(trackHistories).toHaveLength(1)
    })

    it('by user which do not have track histories', async () => {
      const creationPayload = fakeRepoTrackHistoryPayload()
      await trackHistoryRepository.createOne(creationPayload)

      const filter: IFindAllTrackHistoryFilter = { user: fakeEntityId() }
      const trackHistories = await trackHistoryRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(trackHistories)).toBe(true)
      expect(trackHistories).toHaveLength(0)
    })

    it('by track which has track histories', async () => {
      const creationPayload1 = fakeRepoTrackHistoryPayload()
      const creationPayload2 = fakeRepoTrackHistoryPayload()

      await trackHistoryRepository.createOne(creationPayload1)
      await trackHistoryRepository.createOne(creationPayload2)

      const filter: IFindAllTrackHistoryFilter = {
        track: creationPayload1.track,
      }
      const trackHistories = await trackHistoryRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(trackHistories)).toBe(true)
      expect(trackHistories).toHaveLength(1)
    })

    it('by track which does not have track histories', async () => {
      const creationPayload = fakeRepoTrackHistoryPayload()
      await trackHistoryRepository.createOne(creationPayload)

      const filter: IFindAllTrackHistoryFilter = {
        track: fakeEntityId(),
      }
      const trackHistories = await trackHistoryRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(trackHistories)).toBe(true)
      expect(trackHistories).toHaveLength(0)
    })
  })

  describe('Delete one track history', () => {
    let deleteOneSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneSpy = jest.spyOn(trackHistoryRepository, 'deleteOne')
    })

    it('by id which exists', async () => {
      const newTrackHistory = await trackHistoryRepository.createOne(
        fakeRepoTrackHistoryPayload(),
      )

      const filter: IDeleteOneTrackHistoryFilter = { id: newTrackHistory.id }
      const deletedTrackHistory = await trackHistoryRepository.deleteOne(filter)

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(filter)
      expect(deletedTrackHistory.id).toBe(newTrackHistory.id)
      expect(deletedTrackHistory.track.toString()).toBe(
        newTrackHistory.populated('track').toString(),
      )
      expect(deletedTrackHistory.listenDate).toBe(newTrackHistory.listenDate)
      expect(deletedTrackHistory.user.toString()).toBe(
        newTrackHistory.user.toString(),
      )
    })

    it('by id which does not exist and throw not found error', async () => {
      const filter: IDeleteOneTrackHistoryFilter = { id: fakeEntityId() }

      try {
        const deletedTrackHistory = await trackHistoryRepository.deleteOne(
          filter,
        )

        expect(deletedTrackHistory).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })

  describe('Delete many track histories', () => {
    let deleteManySpy: jest.SpyInstance
    let creationPayload1: ReturnType<typeof fakeRepoTrackHistoryPayload>
    let creationPayload2: ReturnType<typeof fakeRepoTrackHistoryPayload>

    beforeEach(async () => {
      deleteManySpy = jest.spyOn(trackHistoryRepository, 'deleteMany')

      creationPayload1 = fakeRepoTrackHistoryPayload()
      creationPayload2 = fakeRepoTrackHistoryPayload()

      await trackHistoryRepository.createOne(creationPayload1)
      await trackHistoryRepository.createOne(creationPayload2)
    })

    it('with empty filter', async () => {
      const filter = {}
      const deletionResult = await trackHistoryRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(2)
    })

    it('by tracks which exists', async () => {
      const filter: IDeleteManyTrackHistoryFilter = {
        trackIds: [creationPayload1.track],
      }

      const deletionResult = await trackHistoryRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(1)
    })

    it('by tracks which do not exist', async () => {
      const filter: IDeleteManyTrackHistoryFilter = {
        trackIds: [fakeEntityId()],
      }

      const deletionResult = await trackHistoryRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(0)
    })
  })
})
