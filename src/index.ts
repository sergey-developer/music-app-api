import cors from 'cors'
import express, { Application } from 'express'

import artistRoute, { artistRoutePath } from 'api/artist/route/artist.route'
import { connectDb } from 'configs/db'
import { envConfig } from 'configs/env'

const run = async () => {
  await connectDb()

  const app: Application = express()

  app.use(express.json())
  app.use(cors())

  app.listen(envConfig.app.port, () => {
    console.log(`Server started on ${envConfig.app.port} port`)

    app.use(artistRoutePath, artistRoute)
  })
}

run()
