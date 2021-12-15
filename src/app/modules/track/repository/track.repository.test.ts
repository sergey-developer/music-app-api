import { container as DiContainer } from 'tsyringe'

import { fakeRepoAlbumPayload } from '__tests__/fakeData/album'
import { fakeRepoArtistPayload } from '__tests__/fakeData/artist'
import { fakeRepoTrackPayload } from '__tests__/fakeData/track'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { DatabaseNotFoundError, DatabaseValidationError } from 'database/errors'
import { ITrackDocument } from 'database/models/track'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import { AlbumRepository } from 'modules/album/repository'
import { ArtistRepository } from 'modules/artist/repository'
import {
  IDeleteManyTracksFilter,
  IDeleteOneTrackFilter,
  IFindAllTracksFilter,
  IFindOneTrackFilter,
  IUpdateOneTrackFilter,
  TrackRepository,
} from 'modules/track/repository'

let trackRepository: TrackRepository
let albumRepository: AlbumRepository
let artistRepository: ArtistRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.Artist)
  registerModel(DiTokenEnum.Album)
  registerModel(DiTokenEnum.Track)

  trackRepository = DiContainer.resolve(TrackRepository)
  albumRepository = DiContainer.resolve(AlbumRepository)
  artistRepository = DiContainer.resolve(ArtistRepository)
})

afterEach(async () => {
  DiContainer.clearInstances()
  await db.clear()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('Track repository', () => {
  describe('Create one track', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(trackRepository, 'createOne')
    })

    it('with correct data created successfully', async () => {
      const trackPayload = fakeRepoTrackPayload()
      const newTrack = await trackRepository.createOne(trackPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(trackPayload)
      expect(newTrack.populated('album').toString()).toBe(trackPayload.album)
      expect(newTrack.youtube).toBe(trackPayload.youtube)
      expect(newTrack.name).toBe(trackPayload.name)
      expect(newTrack.duration).toBe(trackPayload.duration)
    })

    it('with incorrect data throw validation error', async () => {
      const trackPayload = fakeRepoTrackPayload(null, {
        isIncorrect: true,
      })

      try {
        const newTrack = await trackRepository.createOne(trackPayload)
        expect(newTrack).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(trackPayload)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })
  })

  describe('Update one track', () => {
    let updateOneSpy: jest.SpyInstance

    beforeEach(() => {
      updateOneSpy = jest.spyOn(trackRepository, 'updateOne')
    })

    it('by id with correct data updated successfully', async () => {
      const trackPayload = fakeRepoTrackPayload()
      const newTrack = await trackRepository.createOne(trackPayload)

      const filter: IUpdateOneTrackFilter = { id: newTrack.id }
      const trackUpdates = fakeRepoTrackPayload()
      const updatedTrack = await trackRepository.updateOne(filter, trackUpdates)

      expect(updateOneSpy).toBeCalledTimes(1)
      expect(updateOneSpy).toBeCalledWith(filter, trackUpdates)
      expect(updatedTrack.id).toBe(newTrack.id)
      expect(updatedTrack.name).not.toBe(newTrack.name)
      expect(updatedTrack.youtube).not.toBe(newTrack.youtube)
      expect(updatedTrack.duration).not.toBe(newTrack.duration)
      expect(updatedTrack.populated('album').toString()).not.toBe(
        newTrack.populated('album').toString(),
      )
    })

    it('by id with incorrect data throw validation error', async () => {
      const trackPayload = fakeRepoTrackPayload()
      const newTrack = await trackRepository.createOne(trackPayload)

      const filter: IUpdateOneTrackFilter = { id: newTrack.id }
      const trackUpdates = fakeRepoTrackPayload(null, { isIncorrect: true })

      try {
        const updatedTrack = await trackRepository.updateOne(
          filter,
          trackUpdates,
        )

        expect(updatedTrack).not.toBeTruthy()
      } catch (error) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(updateOneSpy).toBeCalledWith(filter, trackUpdates)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })

    it('by id which not exist and throw not found error', async () => {
      const filter: IUpdateOneTrackFilter = { id: fakeEntityId() }
      const trackUpdates = fakeRepoTrackPayload()

      try {
        const updatedTrack = await trackRepository.updateOne(
          filter,
          trackUpdates,
        )

        expect(updatedTrack).not.toBeTruthy()
      } catch (error) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(updateOneSpy).toBeCalledWith(filter, trackUpdates)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })

  describe('Find all tracks', () => {
    let findAllWhereSpy: jest.SpyInstance

    beforeEach(() => {
      findAllWhereSpy = jest.spyOn(trackRepository, 'findAllWhere')
    })

    it('with empty filter', async () => {
      const trackPayload1 = fakeRepoTrackPayload()
      const trackPayload2 = fakeRepoTrackPayload()

      await trackRepository.createOne(trackPayload1)
      await trackRepository.createOne(trackPayload2)

      const filter = {}
      const tracks = await trackRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(tracks)).toBe(true)
      expect(tracks).toHaveLength(2)
    })

    it('by ids which exists', async () => {
      const payload1 = fakeRepoTrackPayload()
      const payload2 = fakeRepoTrackPayload()

      const newTrack1 = await trackRepository.createOne(payload1)
      await trackRepository.createOne(payload2)

      const filter: IFindAllTracksFilter = { ids: [newTrack1.id] }
      const tracks = await trackRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(tracks)).toBe(true)
      expect(tracks).toHaveLength(1)
    })

    it('by ids which not exists', async () => {
      const payload = fakeRepoTrackPayload()
      await trackRepository.createOne(payload)

      const filter: IFindAllTracksFilter = {
        ids: [fakeEntityId()],
      }

      const tracks = await trackRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(tracks)).toBe(true)
      expect(tracks).toHaveLength(0)
    })

    it('by albums which have tracks', async () => {
      const payload1 = fakeRepoTrackPayload()
      const payload2 = fakeRepoTrackPayload()

      await trackRepository.createOne(payload1)
      await trackRepository.createOne(payload2)

      const filter: IFindAllTracksFilter = {
        albumIds: [payload1.album],
      }

      const tracks = await trackRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(tracks)).toBe(true)
      expect(tracks).toHaveLength(1)
    })

    it('by albums which do not have tracks', async () => {
      const payload = fakeRepoTrackPayload()
      await trackRepository.createOne(payload)

      const filter: IFindAllTracksFilter = {
        albumIds: [fakeEntityId()],
      }

      const tracks = await trackRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(tracks)).toBe(true)
      expect(tracks).toHaveLength(0)
    })

    it('by album which has tracks', async () => {
      const payload1 = fakeRepoTrackPayload()
      const payload2 = fakeRepoTrackPayload()

      await trackRepository.createOne(payload1)
      await trackRepository.createOne(payload2)

      const filter: IFindAllTracksFilter = {
        albumId: payload1.album,
      }

      const tracks = await trackRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(tracks)).toBe(true)
      expect(tracks).toHaveLength(1)
    })

    it('by album which does not have tracks', async () => {
      const payload = fakeRepoTrackPayload()
      await trackRepository.createOne(payload)

      const filter: IFindAllTracksFilter = {
        albumId: fakeEntityId(),
      }

      const tracks = await trackRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(tracks)).toBe(true)
      expect(tracks).toHaveLength(0)
    })

    it('by artist which has tracks', async () => {
      const newArtist1 = await artistRepository.createOne(
        fakeRepoArtistPayload(),
      )
      const newArtist2 = await artistRepository.createOne(
        fakeRepoArtistPayload(),
      )

      const newAlbum1 = await albumRepository.createOne(
        fakeRepoAlbumPayload({ artist: newArtist1.id }),
      )
      const newAlbum2 = await albumRepository.createOne(
        fakeRepoAlbumPayload({ artist: newArtist2.id }),
      )

      await trackRepository.createOne(
        fakeRepoTrackPayload({ album: newAlbum1.id }),
      )
      await trackRepository.createOne(
        fakeRepoTrackPayload({ album: newAlbum2.id }),
      )

      const filter: IFindAllTracksFilter = {
        artist: newArtist1.id,
      }

      const tracks = await trackRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(tracks)).toBe(true)
      expect(tracks).toHaveLength(1)
    })

    it('by artist which does not have tracks', async () => {
      const artist = await artistRepository.createOne(fakeRepoArtistPayload())

      const album = await albumRepository.createOne(
        fakeRepoAlbumPayload({ artist: artist.id }),
      )

      await trackRepository.createOne(fakeRepoTrackPayload({ album: album.id }))

      const filter: IFindAllTracksFilter = {
        artist: fakeEntityId(),
      }

      const tracks = await trackRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(tracks)).toBe(true)
      expect(tracks).toHaveLength(0)
    })
  })

  describe('Find one track', () => {
    let findOneSpy: jest.SpyInstance

    beforeEach(() => {
      findOneSpy = jest.spyOn(trackRepository, 'findOne')
    })

    it('by id which exists', async () => {
      const trackPayload = fakeRepoTrackPayload()
      const newTrack = await trackRepository.createOne(trackPayload)

      const filter: IFindOneTrackFilter = { id: newTrack.id }
      const track = await trackRepository.findOne(filter)

      expect(findOneSpy).toBeCalledTimes(1)
      expect(findOneSpy).toBeCalledWith(filter)
      expect(track.id).toBe(newTrack.id)
      expect(track.name).toBe(newTrack.name)
      expect(track.duration).toBe(newTrack.duration)
      expect(track.youtube).toBe(newTrack.youtube)
      expect(track.populated('album').toString()).toBe(
        newTrack.populated('album').toString(),
      )
    })

    it('by id which not exists and throw not found error', async () => {
      const filter: IFindOneTrackFilter = { id: fakeEntityId() }

      try {
        const track = await trackRepository.findOne(filter)
        expect(track).not.toBeTruthy()
      } catch (error) {
        expect(findOneSpy).toBeCalledTimes(1)
        expect(findOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })

  describe('Delete one track', () => {
    let deleteOneSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneSpy = jest.spyOn(trackRepository, 'deleteOne')
    })

    it('by id which exists', async () => {
      const trackPayload = fakeRepoTrackPayload()
      const newTrack = await trackRepository.createOne(trackPayload)

      const filter: IDeleteOneTrackFilter = { id: newTrack.id }
      const deletedTrack = await trackRepository.deleteOne(filter)

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(filter)
      expect(deletedTrack.id).toBe(newTrack.id)
      expect(deletedTrack.name).toBe(newTrack.name)
      expect(deletedTrack.youtube).toBe(newTrack.youtube)
      expect(deletedTrack.duration).toBe(newTrack.duration)
      expect(deletedTrack.album!.toString()).toBe(
        newTrack.populated('album').toString(),
      )
    })

    it('by id which not exist and throw not found error', async () => {
      const filter: IDeleteOneTrackFilter = { id: fakeEntityId() }

      try {
        const deletedTrack = await trackRepository.deleteOne(filter)
        expect(deletedTrack).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })

  describe('Delete many tracks', () => {
    let deleteManySpy: jest.SpyInstance
    let newTrack1: ITrackDocument
    let newTrack2: ITrackDocument

    beforeEach(async () => {
      deleteManySpy = jest.spyOn(trackRepository, 'deleteMany')

      newTrack1 = await trackRepository.createOne(fakeRepoTrackPayload())
      newTrack2 = await trackRepository.createOne(fakeRepoTrackPayload())
    })

    it('with empty filter', async () => {
      const filter = {}
      const deletionResult = await trackRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(2)
    })

    it('by ids which exists', async () => {
      const filter: IDeleteManyTracksFilter = {
        ids: [newTrack1.id],
      }

      const deletionResult = await trackRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(1)
    })

    it('by ids which not exists', async () => {
      const filter: IDeleteManyTracksFilter = {
        ids: [fakeEntityId()],
      }

      const deletionResult = await trackRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(0)
    })
  })
})
