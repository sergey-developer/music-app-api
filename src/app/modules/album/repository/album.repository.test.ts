import { container as DiContainer } from 'tsyringe'

import { fakeRepoAlbumPayload } from '__tests__/fakeData/album'
import { fakeEntityId } from '__tests__/utils'
import { DatabaseNotFoundError, DatabaseValidationError } from 'database/errors'
import { IAlbumDocument } from 'database/models/album'
import * as db from 'database/utils/db'
import { registerModel } from 'database/utils/registerModels'
import { DiTokenEnum } from 'lib/dependency-injection'
import {
  AlbumRepository,
  IDeleteManyAlbumsFilter,
  IDeleteOneAlbumFilter,
  IFindAllAlbumsFilter,
  IFindOneAlbumFilter,
  IUpdateOneAlbumFilter,
} from 'modules/album/repository'

let albumRepository: AlbumRepository

beforeAll(async () => {
  await db.connect()
})

beforeEach(() => {
  registerModel(DiTokenEnum.Artist)
  registerModel(DiTokenEnum.Album)

  albumRepository = DiContainer.resolve(AlbumRepository)
})

afterEach(async () => {
  DiContainer.clearInstances()
  await db.clear()
})

afterAll(async () => {
  await db.drop()
  await db.disconnect()
})

describe('Album repository', () => {
  describe('Create one album', () => {
    let createOneSpy: jest.SpyInstance

    beforeEach(() => {
      createOneSpy = jest.spyOn(albumRepository, 'createOne')
    })

    it('with correct data created successfully', async () => {
      const creationPayload = fakeRepoAlbumPayload()
      const newAlbum = await albumRepository.createOne(creationPayload)

      expect(createOneSpy).toBeCalledTimes(1)
      expect(createOneSpy).toBeCalledWith(creationPayload)
      expect(newAlbum.id).toBeTruthy()
      expect(newAlbum.name).toBe(creationPayload.name)
      expect(newAlbum.releaseDate).toBe(creationPayload.releaseDate)
      expect(newAlbum.image).toBe(creationPayload.image)
      expect(newAlbum.populated('artist').toString()).toBe(
        creationPayload.artist,
      )
    })

    it('with incorrect data throw validation error', async () => {
      const creationPayload = fakeRepoAlbumPayload(null, {
        isIncorrect: true,
      })

      try {
        const newAlbum = await albumRepository.createOne(creationPayload)
        expect(newAlbum).not.toBeTruthy()
      } catch (error) {
        expect(createOneSpy).toBeCalledTimes(1)
        expect(createOneSpy).toBeCalledWith(creationPayload)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })
  })

  describe('Update one album', () => {
    let updateOneSpy: jest.SpyInstance

    beforeEach(() => {
      updateOneSpy = jest.spyOn(albumRepository, 'updateOne')
    })

    it('by id with correct data updated successfully', async () => {
      const creationPayload = fakeRepoAlbumPayload()
      const newAlbum = await albumRepository.createOne(creationPayload)

      const filter: IUpdateOneAlbumFilter = { id: newAlbum.id }
      const albumUpdates = fakeRepoAlbumPayload()
      const updatedAlbum = await albumRepository.updateOne(filter, albumUpdates)

      expect(updateOneSpy).toBeCalledTimes(1)
      expect(updateOneSpy).toBeCalledWith(filter, albumUpdates)
      expect(updatedAlbum.id).toBe(newAlbum.id)
      expect(updatedAlbum.name).not.toBe(newAlbum.name)
      expect(updatedAlbum.releaseDate).not.toBe(newAlbum.releaseDate)
      expect(updatedAlbum.image).not.toBe(newAlbum.image)
      expect(updatedAlbum.populated('artist').toString()).not.toBe(
        newAlbum.populated('artist').toString(),
      )
    })

    it('by id with incorrect data throw validation error', async () => {
      const creationPayload = fakeRepoAlbumPayload()
      const newAlbum = await albumRepository.createOne(creationPayload)

      const filter: IUpdateOneAlbumFilter = { id: newAlbum.id }
      const albumUpdates = fakeRepoAlbumPayload(null, { isIncorrect: true })

      try {
        const updatedAlbum = await albumRepository.updateOne(
          filter,
          albumUpdates,
        )

        expect(updatedAlbum).not.toBeTruthy()
      } catch (error) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(updateOneSpy).toBeCalledWith(filter, albumUpdates)
        expect(error).toBeInstanceOf(DatabaseValidationError)
      }
    })

    it('by id which not exist and throw not found error', async () => {
      const filter: IUpdateOneAlbumFilter = { id: fakeEntityId() }
      const albumUpdates = fakeRepoAlbumPayload()

      try {
        const updatedAlbum = await albumRepository.updateOne(
          filter,
          albumUpdates,
        )

        expect(updatedAlbum).not.toBeTruthy()
      } catch (error) {
        expect(updateOneSpy).toBeCalledTimes(1)
        expect(updateOneSpy).toBeCalledWith(filter, albumUpdates)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })

  describe('Find all albums', () => {
    let findAllWhereSpy: jest.SpyInstance

    beforeEach(() => {
      findAllWhereSpy = jest.spyOn(albumRepository, 'findAllWhere')
    })

    it('with empty filter', async () => {
      const creationPayload1 = fakeRepoAlbumPayload()
      const creationPayload2 = fakeRepoAlbumPayload()

      await albumRepository.createOne(creationPayload1)
      await albumRepository.createOne(creationPayload2)

      const filter = {}
      const albums = await albumRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(albums)).toBe(true)
      expect(albums).toHaveLength(2)
    })

    it('by ids which exist', async () => {
      const creationPayload1 = fakeRepoAlbumPayload()
      const creationPayload2 = fakeRepoAlbumPayload()

      const newAlbum1 = await albumRepository.createOne(creationPayload1)
      await albumRepository.createOne(creationPayload2)

      const filter: IFindAllAlbumsFilter = { ids: [newAlbum1.id] }
      const albums = await albumRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(albums)).toBe(true)
      expect(albums).toHaveLength(1)
    })

    it('by ids which do not exist', async () => {
      const creationPayload = fakeRepoAlbumPayload()
      await albumRepository.createOne(creationPayload)

      const filter: IFindAllAlbumsFilter = {
        ids: [fakeEntityId()],
      }

      const albums = await albumRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(albums)).toBe(true)
      expect(albums).toHaveLength(0)
    })

    it('by artist which have albums', async () => {
      const creationPayload1 = fakeRepoAlbumPayload()
      const creationPayload2 = fakeRepoAlbumPayload()

      await albumRepository.createOne(creationPayload1)
      await albumRepository.createOne(creationPayload2)

      const filter: IFindAllAlbumsFilter = {
        artist: creationPayload1.artist,
      }

      const albums = await albumRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(albums)).toBe(true)
      expect(albums).toHaveLength(1)
    })

    it('by artist which does not have albums', async () => {
      const creationPayload = fakeRepoAlbumPayload()
      await albumRepository.createOne(creationPayload)

      const filter: IFindAllAlbumsFilter = {
        artist: fakeEntityId(),
      }

      const albums = await albumRepository.findAllWhere(filter)

      expect(findAllWhereSpy).toBeCalledTimes(1)
      expect(findAllWhereSpy).toBeCalledWith(filter)
      expect(Array.isArray(albums)).toBe(true)
      expect(albums).toHaveLength(0)
    })
  })

  describe('Find one album', () => {
    let findOneSpy: jest.SpyInstance

    beforeEach(() => {
      findOneSpy = jest.spyOn(albumRepository, 'findOne')
    })

    it('by id which exists', async () => {
      const creationPayload = fakeRepoAlbumPayload()
      const newAlbum = await albumRepository.createOne(creationPayload)

      const filter: IFindOneAlbumFilter = { id: newAlbum.id }
      const album = await albumRepository.findOne(filter)

      expect(findOneSpy).toBeCalledTimes(1)
      expect(findOneSpy).toBeCalledWith(filter)
      expect(album.id).toBe(newAlbum.id)
      expect(album.name).toBe(newAlbum.name)
      expect(album.releaseDate).toBe(newAlbum.releaseDate)
      expect(album.image).toBe(newAlbum.image)
      expect(album.populated('artist').toString()).toBe(
        newAlbum.populated('artist').toString(),
      )
    })

    it('by id which not exists and throw not found error', async () => {
      const filter: IFindOneAlbumFilter = { id: fakeEntityId() }

      try {
        const album = await albumRepository.findOne(filter)
        expect(album).not.toBeTruthy()
      } catch (error) {
        expect(findOneSpy).toBeCalledTimes(1)
        expect(findOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })

  describe('Delete one album', () => {
    let deleteOneSpy: jest.SpyInstance

    beforeEach(() => {
      deleteOneSpy = jest.spyOn(albumRepository, 'deleteOne')
    })

    it('by id which exists', async () => {
      const creationPayload = fakeRepoAlbumPayload()
      const newAlbum = await albumRepository.createOne(creationPayload)

      const filter: IDeleteOneAlbumFilter = { id: newAlbum.id }
      const deletedAlbum = await albumRepository.deleteOne(filter)

      expect(deleteOneSpy).toBeCalledTimes(1)
      expect(deleteOneSpy).toBeCalledWith(filter)
      expect(deletedAlbum.id).toBe(newAlbum.id)
      expect(deletedAlbum.name).toBe(newAlbum.name)
      expect(deletedAlbum.releaseDate).toBe(newAlbum.releaseDate)
      expect(deletedAlbum.image).toBe(newAlbum.image)
      expect(deletedAlbum.artist!.toString()).toBe(
        newAlbum.populated('artist').toString(),
      )
    })

    it('by id which not exist and throw not found error', async () => {
      const filter: IDeleteOneAlbumFilter = { id: fakeEntityId() }

      try {
        const deletedAlbum = await albumRepository.deleteOne(filter)
        expect(deletedAlbum).not.toBeTruthy()
      } catch (error) {
        expect(deleteOneSpy).toBeCalledTimes(1)
        expect(deleteOneSpy).toBeCalledWith(filter)
        expect(error).toBeInstanceOf(DatabaseNotFoundError)
      }
    })
  })

  describe('Delete many albums', () => {
    let deleteManySpy: jest.SpyInstance
    let newAlbum1: IAlbumDocument
    let newAlbum2: IAlbumDocument

    beforeEach(async () => {
      deleteManySpy = jest.spyOn(albumRepository, 'deleteMany')

      newAlbum1 = await albumRepository.createOne(fakeRepoAlbumPayload())
      newAlbum2 = await albumRepository.createOne(fakeRepoAlbumPayload())
    })

    it('with empty filter', async () => {
      const filter = {}
      const deletionResult = await albumRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(2)
    })

    it('by ids which exists', async () => {
      const filter: IDeleteManyAlbumsFilter = {
        ids: [newAlbum1.id],
      }

      const deletionResult = await albumRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(1)
    })

    it('by ids which not exists', async () => {
      const filter: IDeleteManyAlbumsFilter = {
        ids: [fakeEntityId()],
      }

      const deletionResult = await albumRepository.deleteMany(filter)

      expect(deleteManySpy).toBeCalledTimes(1)
      expect(deleteManySpy).toBeCalledWith(filter)
      expect(deletionResult.deletedCount).toBe(0)
    })
  })
})
