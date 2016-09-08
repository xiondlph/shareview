# shareview
review service

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