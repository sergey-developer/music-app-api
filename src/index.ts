import runApp from 'app/utils/runApp'
import { connect as connectDatabase } from 'database/utils/db'

const runServer = async () => {
  await connectDatabase()
  runApp()
}

runServer()

// TODO: Написать тесты кроме контроллеров. Написал для:
//  session (model, repo, service)
//  user (model, repo, service)
//  trackHistory (service, repo) - проверить и отрефакторить
//  track (repo, service) - проверить и отрефакторить
//  album (repo, service)

// TODO: скопировать PopulatedDoc, только вместо ObjectId | undefined, просто ObjectId
//  и поправить код в тестах где это затрагивает
// TODO: переименовать в creationPayload
// TODO: протестить удаление фото
// TODO: Написать тесты что выбрасывается unknown error и др.

// TODO: положить jest.config/setup в папку __tests__
// TODO: создать свои функции для вызовов faker
// TODO: поправить id: any в типах моделей из-за "extends Document"
// TODO: исп-ть unique validator где он не используется
// TODO: исп-ть lean

// TODO: отрефакторить сообщения для логирования
// TODO: Сделать пагинацию
// TODO: add validation content-type for route level
// TODO: обрабатывать запрос на неизвестный (неопределённый) роут (unmatched route)

// TODO: Настроить cors
// TODO: Документировать код (интерфейсы)
// TODO: установить логин пароль для базы данных
// TODO: Настроить production режим
// TODO: Swagger подключить и генерирование типов для него

// TODO: Создать модель Social (для ссылок на youtube и т.д.)
