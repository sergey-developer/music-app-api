import { container as DiContainer } from 'tsyringe'

import { fakeServiceTrackPayload } from '__tests__/fakeData/track'
import {
  AppNotFoundError,
  AppValidationError,
} from 'app/utils/errors/appErrors'
import { RequestModel } from 'database/models/request'
import { TrackModel } from 'database/models/track'
import * as db from 'database/utils/db'
import generateEntityId from 'database/utils/generateEntityId'
import { DiTokenEnum } from 'lib/dependency-injection'
import { RequestStatusEnum } from 'modules/request/constants'
import { RequestRepository } from 'modules/request/repository'
import { IGetAllTracksFilter, TrackService } from 'modules/track/service'

let trackService: TrackService
let requestRepository: RequestRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  DiContainer.register(DiTokenEnum.Track, {
    useValue: TrackModel,
  })

  DiContainer.register(DiTokenEnum.Request, {
    useValue: RequestModel,
  })

  trackService = DiContainer.resolve(TrackService)

  // requestService = DiContainer.resolve(RequestService)
  requestRepository = DiContainer.resolve(RequestRepository)

  // trackHistoryService = DiContainer.resolve(TrackHistoryService)
  // trackHistoryRepository = DiContainer.resolve(TrackHistoryRepository)
})

afterEach(async () => {
  DiContainer.clearInstances()
  await db.clear()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('Track service', () => {
  describe('Create one track', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(trackService, 'createOne')
    })

    it('with correct data created successfully', async () => {
      const trackPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(trackPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(trackPayload)
      expect(newTrack).toBeTruthy()
    })

    it('with correct data request successfully created for new track', async () => {
      const trackPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(trackPayload)

      const trackRequest = await requestRepository.findOne({
        entity: newTrack.id,
      })

      expect(trackRequest.entity.id).toBe(newTrack.id)
    })

    it('with incorrect data throw validation error', async () => {
      const trackPayload = fakeServiceTrackPayload(null, {
        isIncorrect: true,
      })

      try {
        const newTrack = await trackService.createOne(trackPayload)
        expect(newTrack).not.toBeDefined()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(trackPayload)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })
  })

  describe('Update one track by id', () => {
    let updateOneByIdSpy: jest.SpyInstance

    beforeEach(() => {
      updateOneByIdSpy = jest.spyOn(trackService, 'updateOneById')
    })

    it('with correct data updated successfully', async () => {
      const trackPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(trackPayload)

      const trackUpdates = fakeServiceTrackPayload()
      const updatedTrack = await trackService.updateOneById(
        newTrack.id,
        trackUpdates,
      )

      expect(updateOneByIdSpy).toBeCalledTimes(1)
      expect(updateOneByIdSpy).toBeCalledWith(newTrack.id, trackUpdates)
      expect(updatedTrack).toBeTruthy()
    })

    it('with incorrect data throw validation error', async () => {
      const trackPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(trackPayload)

      const trackUpdates = fakeServiceTrackPayload(null, { isIncorrect: true })

      try {
        const updatedTrack = await trackService.updateOneById(
          newTrack.id,
          trackUpdates,
        )

        expect(updatedTrack).not.toBeDefined()
      } catch (error) {
        expect(updateOneByIdSpy).toBeCalledTimes(1)
        expect(updateOneByIdSpy).toBeCalledWith(newTrack.id, trackUpdates)
        expect(error).toBeInstanceOf(AppValidationError)
      }
    })

    it('which not exist and throw not found error', async () => {
      const trackId = generateEntityId()
      const trackUpdates = fakeServiceTrackPayload()

      try {
        const updatedTrack = await trackService.updateOneById(
          trackId,
          trackUpdates,
        )

        expect(updatedTrack).not.toBeDefined()
      } catch (error) {
        expect(updateOneByIdSpy).toBeCalledTimes(1)
        expect(updateOneByIdSpy).toBeCalledWith(trackId, trackUpdates)
        expect(error).toBeInstanceOf(AppNotFoundError)
      }
    })
  })

  describe('Find all tracks', () => {
    let getAllSpy: jest.SpyInstance

    beforeEach(() => {
      getAllSpy = jest.spyOn(trackService, 'getAll')
    })

    it('with empty filter', async () => {
      await trackService.createOne(fakeServiceTrackPayload())
      await trackService.createOne(fakeServiceTrackPayload())

      const filter = {}
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(2)
    })

    it('by user', async () => {
      const payload1 = fakeServiceTrackPayload()
      const payload2 = fakeServiceTrackPayload()

      await trackService.createOne(payload1)
      await trackService.createOne(payload2)

      const filter: IGetAllTracksFilter = { userId: payload1.user }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(1)
    })

    it('in pending status', async () => {
      await trackService.createOne(fakeServiceTrackPayload())
      await trackService.createOne(fakeServiceTrackPayload())

      const filter: IGetAllTracksFilter = { status: RequestStatusEnum.Pending }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(2)
    })

    it('in approved status', async () => {
      await trackService.createOne(fakeServiceTrackPayload())
      const newTrack2 = await trackService.createOne(fakeServiceTrackPayload())

      await requestRepository.updateOne(
        { entity: newTrack2.id },
        { status: RequestStatusEnum.Approved },
      )

      const filter: IGetAllTracksFilter = { status: RequestStatusEnum.Approved }
      const tracks = await trackService.getAll(filter)

      expect(getAllSpy).toBeCalledTimes(1)
      expect(getAllSpy).toBeCalledWith(filter)
      expect(tracks).toHaveLength(1)
    })

    //   it('by album ids which exists', async () => {
    //     const albumPayload1 = fakeAlbumPayload()
    //     const albumPayload2 = fakeAlbumPayload()
    //
    //     const newAlbum1 = await albumRepository.createOne(albumPayload1)
    //     const newAlbum2 = await albumRepository.createOne(albumPayload2)
    //
    //     const trackPayload1 = fakeRepoTrackPayload({ album: newAlbum1.id })
    //     const trackPayload2 = fakeRepoTrackPayload({ album: newAlbum2.id })
    //
    //     await trackService.createOne(trackPayload1)
    //     await trackService.createOne(trackPayload2)
    //
    //     const filter: IFindAllTracksFilter = {
    //       albumIds: [newAlbum1.id],
    //     }
    //
    //     const tracks = await trackService.findAllWhere(filter)
    //
    //     expect(findAllWhereSpy).toBeCalledTimes(1)
    //     expect(findAllWhereSpy).toBeCalledWith(filter)
    //     expect(Array.isArray(tracks)).toBe(true)
    //     expect(tracks).toHaveLength(1)
    //   })
    //
    //   it('by album ids which not exists', async () => {
    //     const filter: IFindAllTracksFilter = {
    //       albumIds: [generateEntityId()],
    //     }
    //
    //     const tracks = await trackService.findAllWhere(filter)
    //
    //     expect(findAllWhereSpy).toBeCalledTimes(1)
    //     expect(findAllWhereSpy).toBeCalledWith(filter)
    //     expect(Array.isArray(tracks)).toBe(true)
    //     expect(tracks).toHaveLength(0)
    //   })
    //
    //   it('by artist which exists', async () => {
    //     const artistPayload1 = fakeArtistPayload()
    //     const artistPayload2 = fakeArtistPayload()
    //     const newArtist1 = await artistRepository.createOne(artistPayload1)
    //     const newArtist2 = await artistRepository.createOne(artistPayload2)
    //
    //     const albumPayload1 = fakeAlbumPayload({ artist: newArtist1.id })
    //     const albumPayload2 = fakeAlbumPayload({ artist: newArtist2.id })
    //     const albumPayload3 = fakeAlbumPayload({ artist: newArtist1.id })
    //
    //     const newAlbum1 = await albumRepository.createOne(albumPayload1)
    //     const newAlbum2 = await albumRepository.createOne(albumPayload2)
    //     const newAlbum3 = await albumRepository.createOne(albumPayload3)
    //
    //     const trackPayload1 = fakeRepoTrackPayload({ album: newAlbum1.id })
    //     const trackPayload2 = fakeRepoTrackPayload({ album: newAlbum2.id })
    //     const trackPayload3 = fakeRepoTrackPayload({ album: newAlbum3.id })
    //
    //     await trackService.createOne(trackPayload1)
    //     await trackService.createOne(trackPayload2)
    //     await trackService.createOne(trackPayload3)
    //
    //     const filter: IFindAllTracksFilter = {
    //       artist: newArtist1.id,
    //     }
    //
    //     const tracks = await trackService.findAllWhere(filter)
    //
    //     expect(findAllWhereSpy).toBeCalledTimes(1)
    //     expect(findAllWhereSpy).toBeCalledWith(filter)
    //     expect(Array.isArray(tracks)).toBe(true)
    //     expect(tracks).toHaveLength(2)
    //   })
    //
    //   it('by artist which not exists', async () => {
    //     const filter: IFindAllTracksFilter = {
    //       artist: generateEntityId(),
    //     }
    //
    //     const tracks = await trackService.findAllWhere(filter)
    //
    //     expect(findAllWhereSpy).toBeCalledTimes(1)
    //     expect(findAllWhereSpy).toBeCalledWith(filter)
    //     expect(Array.isArray(tracks)).toBe(true)
    //     expect(tracks).toHaveLength(0)
    //   })
  })
  //
  // describe('Find one track', () => {
  //   let findOneSpy: jest.SpyInstance
  //
  //   beforeEach(() => {
  //     findOneSpy = jest.spyOn(trackService, 'findOne')
  //   })
  //
  //   it('by id which exists', async () => {
  //     const trackPayload = fakeRepoTrackPayload()
  //     const newTrack = await trackService.createOne(trackPayload)
  //
  //     const filter: IFindOneTrackFilter = { id: newTrack.id }
  //     const track = await trackService.findOne(filter)
  //
  //     expect(findOneSpy).toBeCalledTimes(1)
  //     expect(findOneSpy).toBeCalledWith(filter)
  //     expect(track.id).toBe(filter.id)
  //   })
  //
  //   it('by id which not exists', async () => {
  //     const filter: IFindOneTrackFilter = { id: generateEntityId() }
  //
  //     try {
  //       const track = await trackService.findOne(filter)
  //       expect(track).not.toBeDefined()
  //     } catch (error) {
  //       expect(findOneSpy).toBeCalledTimes(1)
  //       expect(findOneSpy).toBeCalledWith(filter)
  //       expect(error).toBeInstanceOf(DatabaseNotFoundError)
  //     }
  //   })
  // })
  //
  // describe('Delete one track', () => {
  //   let deleteOneSpy: jest.SpyInstance
  //
  //   beforeEach(() => {
  //     deleteOneSpy = jest.spyOn(trackService, 'deleteOne')
  //   })
  //
  //   it('by id which exists', async () => {
  //     const trackPayload = fakeRepoTrackPayload()
  //     const newTrack = await trackService.createOne(trackPayload)
  //
  //     const filter: IDeleteOneTrackFilter = { id: newTrack.id }
  //     const deletedTrack = await trackService.deleteOne(filter)
  //
  //     expect(deleteOneSpy).toBeCalledTimes(1)
  //     expect(deleteOneSpy).toBeCalledWith(filter)
  //     expect(deletedTrack.id).toBe(newTrack.id)
  //   })
  //
  //   it('by id which not exist and throw not found error', async () => {
  //     const filter: IDeleteOneTrackFilter = { id: generateEntityId() }
  //
  //     try {
  //       const deletedTrack = await trackService.deleteOne(filter)
  //       expect(deletedTrack).not.toBeDefined()
  //     } catch (error) {
  //       expect(deleteOneSpy).toBeCalledTimes(1)
  //       expect(deleteOneSpy).toBeCalledWith(filter)
  //       expect(error).toBeInstanceOf(DatabaseNotFoundError)
  //     }
  //   })
  // })
  //
  // describe('Delete many tracks', () => {
  //   let deleteManySpy: jest.SpyInstance
  //   let newTrack1: ITrackDocument
  //   let newTrack2: ITrackDocument
  //   let newTrack3: ITrackDocument
  //
  //   beforeEach(async () => {
  //     deleteManySpy = jest.spyOn(trackService, 'deleteMany')
  //
  //     newTrack1 = await trackService.createOne(fakeRepoTrackPayload())
  //     newTrack2 = await trackService.createOne(fakeRepoTrackPayload())
  //     newTrack3 = await trackService.createOne(fakeRepoTrackPayload())
  //   })
  //
  //   it('with empty filter', async () => {
  //     const filter = {}
  //     const deletionResult = await trackService.deleteMany(filter)
  //
  //     expect(deleteManySpy).toBeCalledTimes(1)
  //     expect(deleteManySpy).toBeCalledWith(filter)
  //     expect(deletionResult.deletedCount).toBe(3)
  //   })
  //
  //   it('has track ids', async () => {
  //     const filter: IDeleteManyTracksFilter = {
  //       ids: [newTrack1.id, newTrack2.id],
  //     }
  //
  //     const deletionResult = await trackService.deleteMany(filter)
  //
  //     expect(deleteManySpy).toBeCalledTimes(1)
  //     expect(deleteManySpy).toBeCalledWith(filter)
  //     expect(deletionResult.deletedCount).toBe(2)
  //   })
  // })
})
