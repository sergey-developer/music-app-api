import runApp from 'app/run'
import { connectDatabase } from 'database/connection'

const runServer = async () => {
  await connectDatabase()
  runApp()
}

runServer()

// TODO: Добавить валидацию размера для файлов и проверить её
// TODO: remove props with undefined value from dto
// TODO: не добавлять к каждому пути /api, сделать это один раз: app.use('/api', routes)
// TODO: отрефакторить везде сообщения об ошибках (server error, not fount, для логирования и т.д.)
//  где-то добавить, поменять и т.п.

// TODO: в dto вынести сообщения в константы и переиспользовать и протестить это
// TODO: для IsMongoId установить сообщение
// TODO: сделать функцию для генерации таких ошибок { message: 'Album was successfully deleted' }
//  при удалении, not found и т.д.
// TODO: описать тип для ValidationError ответа {message, kind, errors}

// TODO: Исп-ть либу для валидации unique
// TODO: Создать модель Social (для ссылок на youtube и т.д.)
// TODO: переименовать везде поле ...Repository в ...Repo чтобы было короче

// TODO: Обработать случай когда не отправляется файл для загрузки image
// TODO: Добавить валидацию для mongo (если валидация случайно прошла мимо validateDto). Не сохранить нужное поле и выйдет нужная ошибка.

// TODO: Сделать пагинацию
// TODO: Отрефакторить configs
// TODO: добавить роут для загрузки фото /uploads/images как подроут (почитать про это)
// TODO: add validation content-type for route level
// TODO: обрабатывать запрос на неизвестный (неопределённый) роут (unmatched route)

// TODO: Настроить cors
// TODO: Документировать код (интерфейсы)
// TODO: исп-ть DI
// TODO: установить логин пароль для базы данных
// TODO: Написать тесты
// TODO: Настроить production режим
// TODO: Swagger подключить и генерирование типов для него
