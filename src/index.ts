import { runApp } from 'app/utils'
import { connectDatabase } from 'database/connection'

const runServer = async () => {
  await connectDatabase()
  runApp()
}

runServer()

// TODO: отрефакторить везде сообщения об ошибках (server error, not fount, для логирования и т.д.)
//  где-то добавить, поменять и т.п.

// TODO: в dto вынести сообщения в константы и переиспользовать и протестить это
// TODO: сделать функцию для генерации таких ошибок { message: 'Album was successfully deleted' }
//  при удалении, not found и т.д.
// TODO: описать тип для ValidationError ответа {message, kind, errors}

// TODO: Исп-ть либу для валидации unique
// TODO: Создать модель Social (для ссылок на youtube и т.д.)
// TODO: переименовать везде поле ...Repository в ...Repo чтобы было короче

// TODO: Добавить валидацию для mongo (если валидация случайно прошла мимо validateDto). Не сохранить нужное поле и выйдет нужная ошибка.

// TODO: Сделать пагинацию
// TODO: add validation content-type for route level
// TODO: обрабатывать запрос на неизвестный (неопределённый) роут (unmatched route)

// TODO: Настроить cors
// TODO: Документировать код (интерфейсы)
// TODO: установить логин пароль для базы данных
// TODO: Написать тесты
// TODO: Настроить production режим
// TODO: Swagger подключить и генерирование типов для него
