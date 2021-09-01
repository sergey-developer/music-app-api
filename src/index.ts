import runApp from 'app/runApp'
import { connectDb } from 'database/connection'

const init = async () => {
  await connectDb()
  runApp()
}

init()

// TODO: Типы для фильтров, payload отрефакторить
// TODO: переделать такие типы "ArtistDocumentArray" на интерфейсы
// TODO: Добавить валидацию для query params (/:id) также в service, repository
// TODO: Добавить валидацию query string. (как для dto) также в service, repository

// TODO: получать все альбомы и трэки так же как артистов
// TODO: доделать удаление request, вместе с ним и artist, album, track. Вместо удаления помечать как удалённый.
//  При удалении артиста помечаются его альбомы, трэки, история прослушивания, как удаленные.

// TODO: сделать обновление request
// TODO: Обработать везде ошибки
// TODO: Исп-ть либу для валидации unique
// TODO: Создать модель Social (для ссылок на youtube и т.д.)
// TODO: переименовать везде поле ...Repository в ...Repo чтобы было короче

// TODO: Удалять request при удалении artist, album, track
// TODO: Оборачивать успешный ответ в {data: ...} в мидлеваре
// TODO: Обработать случай когда не отправляется файл для загрузки image
// TODO: Добавить валидацию для mongo (если валидация случайно прошла мимо validateDto). Не сохранить нужное поле и выйдет нужная ошибка.
// TODO: Добавить валидацию для файлов и проверить её

// TODO: Сделать пагинацию
// TODO: Отрефакторить configs
// TODO: добавить роут для загрузки фото /uploads/images как подроут (почитать про это)
// TODO: remove props with undefined value from dto
// TODO: add validation content-type for route level
// TODO: обрабатывать запрос на неизвестный роут

// TODO: Настроить cors
// TODO: Документировать код (интерфейсы)
// TODO: исп-ть DI
// TODO: установить логин пароль для базы данных
// TODO: Написать тесты
// TODO: Настроить production режим
// TODO: Настроить логирование ошибок и т.п. (в файл?)
// TODO: Swagger подключить
