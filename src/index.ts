import { runApp } from 'configs/app'
import { connectDb } from 'database/connection'

const init = async () => {
  await connectDb()
  runApp()
}

init()

// TODO: сделать типизацию как в документации
// TODO: Добавить валидацию для /:id и т.п.
// TODO: Добавить валидацию query string.
// TODO: Найти тип для mongoId и исп-ть его в ModelId
// TODO: Обработать везде ошибки

// TODO: Оборачивать успешный ответ в {data: ...} в мидлеваре
// TODO: Исп-ть mongoose autopopulate plugin
// TODO: Обработать случай когда не отправляется файл для загрузки image
// TODO: Добавить валидацию для mongo (если валидация случайно прошла мимо validateDto). Не сохранить нужное поле и выйдет нужная ошибка.
// TODO: Добавить валидацию для файлов и проверить её
// TODO: Добавить валидацию для query params
// TODO: Сделать пагинацию

// TODO: добавить роут для загрузки фото /uploads/images как подроут (почитать про это)
// TODO: remove props with undefined value from dto
// TODO: add validation content-type for route level
// TODO: обрабатывать запрос на неизвестный роут

// TODO: Документировать код (интерфейсы)
// TODO: исп-ть DI
// TODO: установить логин пароль для базы данных
// TODO: Написать тесты
// TODO: Настроить production режим
// TODO: Настроить логирование ошибок и т.п. (в файл?)
// TODO: Swagger подключить
