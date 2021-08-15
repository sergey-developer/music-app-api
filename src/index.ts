import { runApp } from 'configs/app'
import { connectDb } from 'database/connection'

const init = async () => {
  await connectDb()
  runApp()
}

init()

// TODO: исп-ть sanitize для dto
// TODO: Исп-ть mongoose autopopulate plugin

// TODO: добавить роут для загрузки фото /uploads/images как подроут (почитать про это)
// TODO: remove props with undefined value from dto
// TODO: add validation content-type for route level
// TODO: set original file name when saving file, add validation for files and do refactoring

// TODO: исп-ть DI
// TODO: установить логин пароль для базы данных
// TODO: Написать тесты
// TODO: Настроить production режим
// TODO: Настроить логирование ошибок
