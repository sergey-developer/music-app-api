import { container as DiContainer } from 'tsyringe'

import { fakeRepoArtistPayload } from '__tests__/fakeData/artist'
import { fakeEntityId } from '__tests__/fakeData/utils'
import { DatabaseNotFoundError, DatabaseValidationError } from 'database/errors'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import {
  ArtistRepository,
  IDeleteOneArtistFilter,
  IFindAllArtistsFilter,
  IFindOneArtistFilter,
  IUpdateOneArtistFilter,
} from 'modules/artist/repository'

let artistRepository: ArtistRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.Artist)
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

describe('Artist repository', () => {
  describe('Create one artist', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(artistRepository, 'createOne')
    })

    it('with correct data created successfully', async () => {
      const creationPayload = fakeRepoArtistPayload()
      const newArtist = await artistRepository.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newArtist.name).toBe(creationPayload.name)
      expect(newArtist.info).toBe(creationPayload.info)
      expect(newArtist.photo).toBe(creationPayload.photo)
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeRepoArtistPayload({
        isIncorrect: true,
      })

      try {
        const newArtist = await artistRepository.createOne(creationPayload)
        expect(newArtist).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(creationPayload)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })
  })

  describe('Update one artist', () => {
    let updateOneSpy: jest.SpyInstance

    beforeEach(() => {
      updateOneSpy = jest.spyOn(artistRepository, 'updateOne')
    })

    it('by id with correct data updated successfully', async () => {
      const creationPayload = fakeRepoArtistPayload()
      const newArtist = await artistRepository.createOne(creationPayload)

      const filter: IUpdateOneArtistFilter = { id: newArtist.id }
      const artistUpdates = fakeRepoArtistPayload()
      const updatedArtist = await artistRepository.updateOne(
        filter,
        artistUpdates,
      )

      expect(updateOneSpy).toBeCalledTimes(1)
      expect(updateOneSpy).toBeCalledWith(filter, artistUpdates)
      expect(updatedArtist.id).toBe(newArtist.id)
      expect(updatedArtist.name).not.toBe(newArtist.name)
      expect(updatedArtist.info).not.toBe(newArtist.info)
      expect(updatedArtist.photo).not.toBe(newArtist.photo)
    })

    it('by id with incorrect data throw validation error', async () => {
      const creationPayload = fakeRepoArtistPayload()
      const newArtist = await artistRepository.createOne(creationPayload)

      const filter: IUpdateOneArtistFilter = { id: newArtist.id }
      const artistUpdates = fakeRepoArtistPayload({ isIncorrect: true })

      try {
        const updatedArtist = await artistRepository.updateOne(
          filter,
          artistUpdates,
        )

        expect(updatedArtist).not.toBeTruthy()
      } catch (error) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(updateOneSpy).toBeCalledWith(filter, artistUpdates)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })

    it('by id which not exist and throw not found error', async () => {
      const filter: IUpdateOneArtistFilter = { id: fakeEntityId() }
      const artistUpdates = fakeRepoArtistPayload()

      try {
        const updatedArtist = await artistRepository.updateOne(
          filter,
          artistUpdates,
        )

        expect(updatedArtist).not.toBeTruthy()
      } catch (error) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(updateOneSpy).toBeCalledWith(filter, artistUpdates)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })

  describe('Find all artists', () => {
    let findAllWhereSpy: jest.SpyInstance

    beforeEach(() => {
      findAllWhereSpy = jest.spyOn(artistRepository, 'findAllWhere')
    })

    it('with empty filter', async () => {
      const creationPayload1 = fakeRepoArtistPayload()
      const creationPayload2 = fakeRepoArtistPayload()

      await artistRepository.createOne(creationPayload1)
      await artistRepository.createOne(creationPayload2)

      const filter = {}
      const artists = await artistRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(artists)).toBe(true)
      expect(artists).toHaveLength(2)
    })

    it('by ids which exists', async () => {
      const creationPayload1 = fakeRepoArtistPayload()
      const creationPayload2 = fakeRepoArtistPayload()

      const newArtist1 = await artistRepository.createOne(creationPayload1)
      await artistRepository.createOne(creationPayload2)

      const filter: IFindAllArtistsFilter = { ids: [newArtist1.id] }
      const artists = await artistRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(artists)).toBe(true)
      expect(artists).toHaveLength(1)
    })

    it('by ids which not exists', async () => {
      const creationPayload = fakeRepoArtistPayload()
      await artistRepository.createOne(creationPayload)

      const filter: IFindAllArtistsFilter = {
        ids: [fakeEntityId()],
      }

      const artists = await artistRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(artists)).toBe(true)
      expect(artists).toHaveLength(0)
    })
  })

  describe('Find one artist', () => {
    let findOneSpy: jest.SpyInstance

    beforeEach(() => {
      findOneSpy = jest.spyOn(artistRepository, 'findOne')
    })

    it('by id which exists', async () => {
      const creationPayload = fakeRepoArtistPayload()
      const newArtist = await artistRepository.createOne(creationPayload)

      const filter: IFindOneArtistFilter = { id: newArtist.id }
      const artist = await artistRepository.findOne(filter)

      expect(findOneSpy).toBeCalledTimes(1)
      expect(findOneSpy).toBeCalledWith(filter)
      expect(artist.id).toBe(newArtist.id)
      expect(artist.name).toBe(newArtist.name)
      expect(artist.info).toBe(newArtist.info)
      expect(artist.photo).toBe(newArtist.photo)
    })

    it('by id which not exists and throw not found error', async () => {
      const filter: IFindOneArtistFilter = { id: fakeEntityId() }

      try {
        const artist = await artistRepository.findOne(filter)
        expect(artist).not.toBeTruthy()
      } catch (error) {
        expect(findOneSpy).toBeCalledTimes(1)
        expect(findOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })

  describe('Delete one artist', () => {
    let deleteOneSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneSpy = jest.spyOn(artistRepository, 'deleteOne')
    })

    it('by id which exists', async () => {
      const creationPayload = fakeRepoArtistPayload()
      const newArtist = await artistRepository.createOne(creationPayload)

      const filter: IDeleteOneArtistFilter = { id: newArtist.id }
      const deletedArtist = await artistRepository.deleteOne(filter)

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(filter)
      expect(deletedArtist.id).toBe(newArtist.id)
      expect(deletedArtist.name).toBe(newArtist.name)
      expect(deletedArtist.info).toBe(newArtist.info)
      expect(deletedArtist.photo).toBe(newArtist.photo)
    })

    it('by id which not exist and throw not found error', async () => {
      const filter: IDeleteOneArtistFilter = { id: fakeEntityId() }

      try {
        const deletedArtist = await artistRepository.deleteOne(filter)
        expect(deletedArtist).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })
})
