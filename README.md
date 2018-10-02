# Настройка и установка проекта
## Требования для работы
Вам потребуется
1. установленный и включенный сервер [5.7.22 MySQL Community Server (GPL)](https://dev.mysql.com/downloads/mysql/5.7.html).
2. почта Yandex (настроена по-умолчанию) или любая другая, поддерживающая протокол smtp.
3. API-ключ для сервиса zzap.

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

* Конфигурация почты

Если вы хотите изменить сервер, используемый для отправки сообщений сервером, то следует перейти в директорию конфигурации почты [`./config/config.example.js`](https://github.com/PonyLianna/excel-zzap/blob/master/config/config.example.js) (переменная `config.emailConfig`) и изменить **[service](https://nodemailer.com/smtp/well-known/)** по одному из предусмотренных модулем или напрямую через **[SMTP](https://nodemailer.com/smtp/)**.

`config.emailUsername` - имя пользователя.

`config.emailPassword` - пароль.

**Конфигурация passport**

`config.secret` - важное поле, используемое для шифрования hash'a сессии. 
Следует изменить при использовании на рабочем сервере

**zzap**

`config.api_key` - API-ключ сервиса zzap.

**Frontend**

 [`./config/config.js`](https://github.com/PonyLianna/excel-zzap/blob/master/config/config.example.js)
[`./public/js/socket.js`](https://github.com/PonyLianna/excel-zzap/blob/master/public/js/socket.js) - так как при создании проекта не был использован фронтфреймворк, то осталась особенность изменений внутри файлов фронта информации вручную (нужно поменять порт при отличии со стандартного `8080`)

### Запуск Сервера
Сервер снабжен рядом команд для упрощения работы с ним, а именно рядом скриптов для тестирования и облегчения работы.

`npm run create` - инициализация необходимых для работы таблиц вместе с необходимыми данными.

`npm run recreate` - пересозданиe базы данных.

`npm run addUser` - добавление пользователя. 

Пример: `npm run addUser test 123`- добавит в базу данных пользователя **test** с паролем **123**.

`npm run deleteUser` - удаление пользователя из базы данных вместе с очищением всех его сессий.

Пример: `npm run deleteUser test` - удалит пользователя **test** из базы данных, а так же удалит все сессии из таблицы **sessions**
