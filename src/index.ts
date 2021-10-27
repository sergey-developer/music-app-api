import { runApp } from 'app/utils'
import { connectDatabase } from 'database/connection'

const runServer = async () => {
  await connectDatabase()
  runApp()
}

runServer()

// TODO: отрефакторить ответ из-за unique ошибки и getDtoValidationErrors,
//  привести их к одной структуре
// TODO: отрефакторить сообщения для логирования
// TODO: Добавить валидацию в моделях

// TODO: сделать функцию для генерации таких ошибок { message: 'Album was successfully deleted' }
//  при удалении, not found и т.д.
// TODO: описать тип для ValidationError ответа {message, kind, errors}

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
