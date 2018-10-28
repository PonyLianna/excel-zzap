# Настройка и установка проекта
## Требования для работы
Вам потребуется
1. установленный и включенный сервер [5.7.22 MySQL Community Server (GPL)](https://dev.mysql.com/downloads/mysql/5.7.html).
2. API-ключ для сервиса zzap.

## Установка
`git clone https://github.com/PonyLianna/excel-zzap` 

## Дальнейшая конфигурация 
Для дальнейшей работы сервиса вам потребуется установить зависимости командой 
`npm install`
NPM автоматически установит все зависимости и приведет менеджер в полуготовность.

После установки зависимостей стоит настроить файл конфигураций в  [`./config/config.example.js`](https://github.com/PonyLianna/excel-zzap/blob/master/config/config.example.js)

### Детально про config.js

* Общая конфигурация

`config.port` - порт, используемый приложением для подключения.

`config.dbname` - название базы данных.

`config.dbconfig` - данные для подключения к базе.

`config.csv.path` - путь для сохранения файла `.csv`

**Конфигурация passport**

`config.secret` - важное поле, используемое для шифрования hash'a сессии. 
Следует изменить при использовании на рабочем сервере

**zzap**

`config.api_key` - API-ключ сервиса zzap.

**Frontend**

[`./public/js/socket.js`](https://github.com/PonyLianna/excel-zzap/blob/master/public/js/socket.js) - так как при создании проекта не был использован фронтфреймворк, то осталась особенность изменений внутри файлов фронта информации вручную (нужно поменять порт при отличии от стандартного `8080`)

### Логгирование
Сохранение логов происходит в специальную папку, предназначенную для них `/logs`

`npm run cleanLogs` позволяет экстренно избавиться от логов

### Запуск Сервера
Сервер снабжен рядом команд для упрощения работы с ним, а именно рядом скриптов для тестирования и облегчения работы.

#### Инициализация

`npm run create` - инициализация необходимых для работы таблиц вместе с необходимыми данными.

`npm run recreate` - пересозданиe базы данных.

`npm run addUser` - добавление пользователя. 

Пример: `npm run addUser test 123`- добавит в базу данных пользователя **test** с паролем **123**.

`npm run deleteUser` - удаление пользователя из базы данных вместе с очищением всех его сессий.

Пример: `npm run deleteUser test` - удалит пользователя **test** из базы данных, а так же удалит все сессии из таблицы **sessions**

#### Запуск Сервера и службы

`npm start` - консольный запуск сервера

`npm run service` - запуск сервера в виде службы

`npm run monitor` - мониторинг сервера

`npm run kill` - остановка службы

#### Вывод в CSV файл

CSV файл представляет собой информацию, собранную с zzap и представляет собой следующий формат

| id                       | seller   | vendor_code | price | instock           | wholesale       |
|--------------------------|----------|-------------|-------|-------------------|-----------------|
| Уникальный идентификатор | Продавец | Код товара  | Цена  | Наличие на складе | Опт или розница |
