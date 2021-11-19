import { runApp } from 'app/utils'
import { connect as connectDatabase } from 'database/utils/db'

const runServer = async () => {
  await connectDatabase()
  runApp()
}

runServer()

// TODO: осталось поправить: все контроллеры

// TODO: Написать тесты
// TODO: Написать тесты что выбрасывается server error
// TODO: Поправить в репозиториях названия на findOne, DeleteOne и т.д.

// TODO: Поправить AppError.UnknownError(serverErrorMsg) для serverErrorMsg
//  придумать другое название

// TODO: Настроить jest-extended и исп-ть его
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
