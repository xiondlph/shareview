/**
 * Мок для Nedb плагина
 */

const
    user = {
        period: 1471038756540,
    },
    Nedb = () => {
        return {
            loadDatabase: jest.fn(),

            insert: jest.fn()
            /**
             * Регистрация пользователя (/user/create)
             **********************************************/

                /**
                 * Успешная регистрация
                 */

                // services.secure.user(create) => cuccess
                .mockImplementationOnce((data, cb) => {
                    cb(null, user);
                }),

                // // Регистрация пользователя (/user/create)
                // // Ошибка в create (nedb) - services.secure.user(create) => failed
                // .mockImplementationOnce((data, cb) => {
                //     cb(Error('Nedb error (insert)'));
                // })
                //
                // // Регистрация пользователя (/user/create)
                // // Ошибка в sendMail - services.secure.user(create) => cuccess
                // .mockImplementationOnce((data, cb) => {
                //     cb(null, user);
                // }),

            update: jest.fn(),
                // // Сброс пароля (/user/forgot)
                // // Успешный сброс - services.user.forgot(setPasswordByEmail) => cuccess
                // .mockImplementationOnce((qyery, data, cb) => {
                //     cb(null, user);
                // })
                //
                // // Сброс пароля (/user/forgot)
                // // Ошибка в setPasswordByEmail (nedb) -
                // // services.user.forgot (setPasswordByEmail) => failed
                // .mockImplementationOnce((qyery, data, cb) => {
                //     cb(Error('Nedb error (update)'));
                // })
                //
                // // Сброс пароля (/user/forgot)
                // // Отсутствие затронутых записей в БД -
                // // services.user.forgot(setPasswordByEmail) => cuccess
                // .mockImplementationOnce((qyery, data, cb) => {
                //     cb(null, user);
                // })
                //
                // // Сброс пароля (/user/forgot)
                // // Ошибка в sendMail -
                // // services.user.forgot(setPasswordByEmail) => cuccess
                // .mockImplementationOnce((qyery, data, cb) => {
                //     cb(null, user);
                // })
                //
                // // Авторизация пользователя (/user/signin)
                // // Успешная авторизация -
                // // services.secure.signin (setSessionById) => cuccess
                // .mockImplementationOnce((qyery, data, cb) => {
                //     cb(null, user);
                // })
                //
                // // Авторизация пользователя (/user/signin)
                // // Ошибка в setSessionById (nedb) -
                // // services.secure.signin (setSessionById) => failed
                // .mockImplementationOnce((qyery, data, cb) => {
                //     cb(Error('Nedb error (update)'));
                // })
                //
                // // Выход из сессии (/user/signout)
                // // Успешный выход из сессии -
                // // services.secure.signout (unsetSessionById) => cuccess
                // .mockImplementationOnce((qyery, data, cb) => {
                //     cb(null, user);
                // })
                //
                // // Выход из сессии (/user/signout)
                // // Ошибка в unsetSessionById (nedb) -
                // // services.secure.signout (unsetSessionById) => failed
                // .mockImplementationOnce((qyery, data, cb) => {
                //     cb(Error('Nedb error (update)'));
                // })
                //
                // // Обновление данных профиля (/api/profile)
                // // Успешное обновление данных -
                // // services.profile.set (update) => success
                // .mockImplementationOnce((qyery, data, cb) => {
                //     cb(null, user);
                // }),
        };
    };

export default Nedb;

