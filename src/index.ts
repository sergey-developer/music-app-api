import { runApp } from 'app/utils'
import { connectDatabase } from 'database/connection'

const runServer = async () => {
  await connectDatabase()
  runApp()
}

runServer()

// TODO: отрефакторить сообщения для логирования
// TODO: Сделать пагинацию
// TODO: add validation content-type for route level
// TODO: обрабатывать запрос на неизвестный (неопределённый) роут (unmatched route)

// TODO: Настроить cors
// TODO: Документировать код (интерфейсы)
// TODO: установить логин пароль для базы данных
// TODO: Написать тесты
// TODO: Настроить production режим
// TODO: Swagger подключить и генерирование типов для него

// TODO: Создать модель Social (для ссылок на youtube и т.д.)
