import * as db from 'database/utils/db'

const setupDB = (): void => {
  beforeAll(async () => {
    await db.connect()
  })

  afterEach(async () => {
    await db.clear()
  })

  afterAll(async () => {
    await db.drop()
    await db.disconnect()
  })
}

export default setupDB
