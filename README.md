# shareview
review service

# Сообщения об ошибках

В случае возникновения ошибки обработка запроса прекращается,
сервер возвращает HTTP-статус ответа, отражающий суть произошедшей ошибки.
Кроме статуса в ответе передается краткое описание ошибки.

Сообщение об ошибке возвращается в формате JSON

## Внутренняя ошибка сервера
HTTP-статус: `500`

**Выходные данные**
```js
// Описание ошибки (500)
{
    errors: [
        'Internal server error'
    ]
}
```

## Отсутсвие доступа к ресурсу
HTTP-статус: `403`

**Выходные данные**
```js
// Описание ошибки (403)
{
    errors: [
        'Forbidden resource'
    ]
}
```

# Роуты
## Регистрация пользователя
POST: `/user/create`

**Входные данные**
```js
{
    email: 'simple@email.com'
}
```

**Выходные данные**
```js
// Успешная регистрация
{
    success: true
}
```

```js
// Пользователь с таким email уже есть
{
    success: false,
    exist: true
}
```

## Авторизация пользователя
POST: `/user/signin`

**Входные данные**
```js
{
    email: 'simple@email.com',
    password: 'password'
}
```

**Выходные данные**
```js
// Успешная регистрация
{
    success: true
}
```

```js
// Неверные логин/пароль
{
    success: false
}
```

## Сброс пароля
POST `/user/forgot`

**Входные данные**
```js
{
    email: 'simple@email.com'
}
```

**Выходные данные**
```js
// Успешный сброс пароля
{
    success: true
}
```

```js
// Пользователь не найден
{
    success: false
}
```