import { container as DiContainer } from 'tsyringe'

import { fakeServiceTrackPayload } from '__tests__/fakeData/track'
import { AppValidationError } from 'app/utils/errors/appErrors'
import { RequestModel } from 'database/models/request'
import { TrackModel } from 'database/models/track'
import * as db from 'database/utils/db'
import { DiTokenEnum } from 'lib/dependency-injection'
import { RequestRepository } from 'modules/request/repository'
import { RequestService } from 'modules/request/service'
import { TrackRepository } from 'modules/track/repository'
import { TrackService } from 'modules/track/service'
import { TrackHistoryRepository } from 'modules/trackHistory/repository'
import { TrackHistoryService } from 'modules/trackHistory/service'

let trackService: TrackService
let trackRepository: TrackRepository

// let requestService: RequestService
let requestRepository: RequestRepository

// let trackHistoryService: TrackHistoryService
// let trackHistoryRepository: TrackHistoryRepository

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
  trackRepository = DiContainer.resolve(TrackRepository)

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

    it('request successfully created for new track', async () => {
      const trackPayload = fakeServiceTrackPayload()
      const newTrack = await trackService.createOne(trackPayload)

      const trackRequest = await requestRepository.findOne({
        entity: newTrack.id,
      })

      expect(trackRequest.entity.id).toBe(newTrack.id)
    })
  })

  // describe('Update one track', () => {
  //   let updateOneSpy: jest.SpyInstance
  //
  //   beforeEach(() => {
  //     updateOneSpy = jest.spyOn(trackRepository, 'updateOne')
  //   })
  //
  //   it('by id with correct data updated successfully', async () => {
  //     const albumPayload1 = fakeAlbumPayload()
  //     const albumPayload2 = fakeAlbumPayload()
  //
  //     const newAlbum1 = await albumRepository.createOne(albumPayload1)
  //     const newAlbum2 = await albumRepository.createOne(albumPayload2)
  //
  //     const trackPayload = fakeRepoTrackPayload({ album: newAlbum1.id })
  //     const newTrack = await trackRepository.createOne(trackPayload)
  //
  //     const filter: IUpdateOneTrackFilter = { id: newTrack.id }
  //     const trackUpdates = fakeRepoTrackPayload({ album: newAlbum2.id })
  //     const updatedTrack = await trackRepository.updateOne(filter, trackUpdates)
  //
  //     expect(updateOneSpy).toBeCalledTimes(1)
  //     expect(updateOneSpy).toBeCalledWith(filter, trackUpdates)
  //     expect(updatedTrack.id).toBe(newTrack.id)
  //     expect(updatedTrack.name).not.toBe(newTrack.name)
  //     expect(updatedTrack.youtube).not.toBe(newTrack.youtube)
  //     expect(updatedTrack.duration).not.toBe(newTrack.duration)
  //     expect(updatedTrack.album!.id).not.toBe(newTrack.album!.id)
  //   })
  //
  //   it('by id with incorrect data throw validation error', async () => {
  //     const trackPayload = fakeRepoTrackPayload()
  //     const newTrack = await trackRepository.createOne(trackPayload)
  //
  //     const filter: IUpdateOneTrackFilter = { id: newTrack.id }
  //     const trackUpdates = fakeRepoTrackPayload(null, { isIncorrect: true })
  //
  //     try {
  //       const updatedTrack = await trackRepository.updateOne(
  //         filter,
  //         trackUpdates,
  //       )
  //
  //       expect(updatedTrack).not.toBeDefined()
  //     } catch (error) {
  //       expect(updateOneSpy).toBeCalledTimes(1)
  //       expect(updateOneSpy).toBeCalledWith(filter, trackUpdates)
  //       expect(error).toBeInstanceOf(DatabaseValidationError)
  //     }
  //   })
  //
  //   it('by id which not exist and throw not found error', async () => {
  //     const filter: IUpdateOneTrackFilter = { id: generateEntityId() }
  //     const trackUpdates = fakeRepoTrackPayload()
  //
  //     try {
  //       const updatedTrack = await trackRepository.updateOne(
  //         filter,
  //         trackUpdates,
  //       )
  //
  //       expect(updatedTrack).not.toBeDefined()
  //     } catch (error) {
  //       expect(updateOneSpy).toBeCalledTimes(1)
  //       expect(updateOneSpy).toBeCalledWith(filter, trackUpdates)
  //       expect(error).toBeInstanceOf(DatabaseNotFoundError)
  //     }
  //   })
  // })
  //
  // describe('Find all tracks', () => {
  //   let findAllWhereSpy: jest.SpyInstance
  //
  //   beforeEach(() => {
  //     findAllWhereSpy = jest.spyOn(trackRepository, 'findAllWhere')
  //   })
  //
  //   it('with empty filter', async () => {
  //     const trackPayload1 = fakeRepoTrackPayload()
  //     const trackPayload2 = fakeRepoTrackPayload()
  //
  //     await trackRepository.createOne(trackPayload1)
  //     await trackRepository.createOne(trackPayload2)
  //
  //     const filter = {}
  //     const tracks = await trackRepository.findAllWhere(filter)
  //
  //     expect(findAllWhereSpy).toBeCalledTimes(1)
  //     expect(findAllWhereSpy).toBeCalledWith(filter)
  //     expect(Array.isArray(tracks)).toBe(true)
  //     expect(tracks).toHaveLength(2)
  //   })
  //
  //   it('by ids which exists', async () => {
  //     const trackPayload1 = fakeRepoTrackPayload()
  //     const trackPayload2 = fakeRepoTrackPayload()
  //
  //     const newTrack1 = await trackRepository.createOne(trackPayload1)
  //     await trackRepository.createOne(trackPayload2)
  //
  //     const filter: IFindAllTracksFilter = { ids: [newTrack1.id] }
  //     const tracks = await trackRepository.findAllWhere(filter)
  //
  //     expect(findAllWhereSpy).toBeCalledTimes(1)
  //     expect(findAllWhereSpy).toBeCalledWith(filter)
  //     expect(Array.isArray(tracks)).toBe(true)
  //     expect(tracks).toHaveLength(1)
  //   })
  //
  //   it('by ids which not exists', async () => {
  //     const filter: IFindAllTracksFilter = {
  //       ids: [generateEntityId()],
  //     }
  //
  //     const tracks = await trackRepository.findAllWhere(filter)
  //
  //     expect(findAllWhereSpy).toBeCalledTimes(1)
  //     expect(findAllWhereSpy).toBeCalledWith(filter)
  //     expect(Array.isArray(tracks)).toBe(true)
  //     expect(tracks).toHaveLength(0)
  //   })
  //
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
  //     await trackRepository.createOne(trackPayload1)
  //     await trackRepository.createOne(trackPayload2)
  //
  //     const filter: IFindAllTracksFilter = {
  //       albumIds: [newAlbum1.id],
  //     }
  //
  //     const tracks = await trackRepository.findAllWhere(filter)
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
  //     const tracks = await trackRepository.findAllWhere(filter)
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
  //     await trackRepository.createOne(trackPayload1)
  //     await trackRepository.createOne(trackPayload2)
  //     await trackRepository.createOne(trackPayload3)
  //
  //     const filter: IFindAllTracksFilter = {
  //       artist: newArtist1.id,
  //     }
  //
  //     const tracks = await trackRepository.findAllWhere(filter)
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
  //     const tracks = await trackRepository.findAllWhere(filter)
  //
  //     expect(findAllWhereSpy).toBeCalledTimes(1)
  //     expect(findAllWhereSpy).toBeCalledWith(filter)
  //     expect(Array.isArray(tracks)).toBe(true)
  //     expect(tracks).toHaveLength(0)
  //   })
  // })
  //
  // describe('Find one track', () => {
  //   let findOneSpy: jest.SpyInstance
  //
  //   beforeEach(() => {
  //     findOneSpy = jest.spyOn(trackRepository, 'findOne')
  //   })
  //
  //   it('by id which exists', async () => {
  //     const trackPayload = fakeRepoTrackPayload()
  //     const newTrack = await trackRepository.createOne(trackPayload)
  //
  //     const filter: IFindOneTrackFilter = { id: newTrack.id }
  //     const track = await trackRepository.findOne(filter)
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
  //       const track = await trackRepository.findOne(filter)
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
  //     deleteOneSpy = jest.spyOn(trackRepository, 'deleteOne')
  //   })
  //
  //   it('by id which exists', async () => {
  //     const trackPayload = fakeRepoTrackPayload()
  //     const newTrack = await trackRepository.createOne(trackPayload)
  //
  //     const filter: IDeleteOneTrackFilter = { id: newTrack.id }
  //     const deletedTrack = await trackRepository.deleteOne(filter)
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
  //       const deletedTrack = await trackRepository.deleteOne(filter)
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
  //     deleteManySpy = jest.spyOn(trackRepository, 'deleteMany')
  //
  //     newTrack1 = await trackRepository.createOne(fakeRepoTrackPayload())
  //     newTrack2 = await trackRepository.createOne(fakeRepoTrackPayload())
  //     newTrack3 = await trackRepository.createOne(fakeRepoTrackPayload())
  //   })
  //
  //   it('with empty filter', async () => {
  //     const filter = {}
  //     const deletionResult = await trackRepository.deleteMany(filter)
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
  //     const deletionResult = await trackRepository.deleteMany(filter)
  //
  //     expect(deleteManySpy).toBeCalledTimes(1)
  //     expect(deleteManySpy).toBeCalledWith(filter)
  //     expect(deletionResult.deletedCount).toBe(2)
  //   })
  // })
})
