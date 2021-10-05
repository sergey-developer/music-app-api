import runApp from 'app/runApp'
import { connectDb } from 'database/connection'

const init = async () => {
  await connectDb()
  runApp()
}

init()

// TODO: Обработать везде ошибки и поставить тип ошибки в catch
// TODO: сделать обновление request
// TODO: доделать удаление request.
// TODO: Удалять request при удалении artist, album, track
// TODO: remove props with undefined value from dto
// TODO: сделать DocumentId = string

// TODO: в dto вынести сообщения в константы и переиспользовать
// TODO: для IsMongoId установить сообщение
// TODO: сделать обработку ошибок в контроллерах как у album
// TODO: сделать функцию для генерации таких ошибок { message: 'Album was successfully deleted' }
//  при удалении, not found и т.д.
// TODO: описать тип для ValidationError ответа {message, kind, errors}
// TODO: настроить выдачу статических файлов (express.static)

// TODO: получать все альбомы и трэки так же как артистов

// TODO: Исп-ть либу для валидации unique
// TODO: Создать модель Social (для ссылок на youtube и т.д.)
// TODO: переименовать везде поле ...Repository в ...Repo чтобы было короче

// TODO: Обработать случай когда не отправляется файл для загрузки image
// TODO: Добавить валидацию для mongo (если валидация случайно прошла мимо validateDto). Не сохранить нужное поле и выйдет нужная ошибка.
// TODO: Добавить валидацию для файлов и проверить её

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
// TODO: Настроить логирование ошибок и т.п. (в файл?)
// TODO: Swagger подключить и генерирование типов для него
