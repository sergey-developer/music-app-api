import runApp from 'app/runApp'
import { connectDb } from 'database/connection'

const init = async () => {
  await connectDb()
  runApp()
}

init()

// TODO: Добавить валидацию для /:id и т.п.
// TODO: Добавить валидацию query string. (как для dto)
// TODO: Обработать везде ошибки
// TODO: Исп-ть либу для валидации unique
// TODO: Создать модель PublishRequest
// TODO: Создать модель Social (для ссылок на youtube и т.д.)
// TODO: Разделить модели где есть published, создать Base"ModelName" и "ModelName" с полем published

// TODO: Оборачивать успешный ответ в {data: ...} в мидлеваре
// TODO: Обработать случай когда не отправляется файл для загрузки image
// TODO: Добавить валидацию для mongo (если валидация случайно прошла мимо validateDto). Не сохранить нужное поле и выйдет нужная ошибка.
// TODO: Добавить валидацию для файлов и проверить её
// TODO: Добавить валидацию для query params

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
