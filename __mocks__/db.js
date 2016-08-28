/**
 * Мок для db модуля
 */

const
    user = {
        _id: '57bb6e49c6051f12e896d424',
        email: 'shukhrat@ismax.ru',
        active: false,
        address: '127.0.01',
        period: 1471987657311,
        password: 'fa8c83c3672c617cb56422f9609b2cd579b5d443e0c07b66754edf297f574f25',
        salt: '9be79a1476b8d6bf4e50d705ff34b4c8b775c61c0deb2d37805f5ecb9fd96551',
        sid: '3fy7m_5CdLUAaboAcdcTMAAblz2OZr4Y',
    },
    find = jest.fn()
        // Регистрация пользователя (/user/create)
        // Успешная регистрация - services.secure.user (getUserBySession) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Регистрация пользователя (/user/create)
        // Успешная регистрация - services.user.create (getUserByEmail) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Регистрация пользователя(/user/create)
        // Ошибка валидации email - services.secure.user => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Регистрация пользователя (/user/create)
        // Ошибка в getUserByEmail - services.secure.user (getUserBySession) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Регистрация пользователя (/user/create)
        // Ошибка в getUserByEmail - services.user.create (getUserByEmail) => failed
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.reject(Error('Mongo error (find)'));
                    },
                };
            },
        })

        // Регистрация пользователя (/user/create)
        // Ошибка в create (mongo) - services.secure.user (getUserBySession) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Регистрация пользователя (/user/create)
        // Ошибка в create (mongo) - services.user.create (getUserByEmail) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Регистрация пользователя (/user/create)
        // Ошибка в create (nedb) - services.secure.user (getUserBySession) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Регистрация пользователя (/user/create)
        // Ошибка в create (nedb) - services.user.create (getUserByEmail) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Регистрация пользователя (/user/create)
        // Ошибка в sendMail - services.secure.user (getUserBySession) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Регистрация пользователя (/user/create)
        // Ошибка в sendMail - services.user.create (getUserByEmail) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Сброс пароля (/user/forgot)
        // Успешный сброс - services.user.forgot (getUserBySession) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Сброс пароля (/user/forgot)
        // Ошибка валидации email - services.user.forgot => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Сброс пароля (/user/forgot)
        // Ошибка в setPasswordByEmail (mongo) - services.user.forgot (getUserBySession) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Сброс пароля (/user/forgot)
        // Ошибка в setPasswordByEmail (nedb) - services.user.forgot (getUserBySession) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Сброс пароля (/user/forgot)
        // Отсутствие затронутых записей в БД - services.user.forgot (getUserBySession) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        })

        // Сброс пароля (/user/forgot)
        // Ошибка в sendMail - services.user.forgot (getUserBySession) => cuccess
        .mockReturnValueOnce({
            limit() {
                return {
                    toArray() {
                        return Promise.resolve([]);
                    },
                };
            },
        }),

    insertOne = jest.fn()
        // Регистрация пользователя (/user/create)
        // Успешная регистрация - services.secure.user (create) => cuccess
        .mockReturnValueOnce(Promise.resolve({
            insertedId: user._id,
        }))

        // Регистрация пользователя (/user/create)
        // Ошибка в create (mongo) - services.user.create (create) => failed
        .mockReturnValueOnce(Promise.reject(Error('Mongo error (insertOne)')))

        // Регистрация пользователя (/user/create)
        // Ошибка в create (nedb) - services.user.create (create) => failed
        .mockReturnValueOnce(Promise.resolve({
            insertedId: user._id,
        }))

        // Регистрация пользователя (/user/create)
        // Ошибка в sendMail - services.secure.user (create) => cuccess
        .mockReturnValueOnce(Promise.resolve({
            insertedId: user._id,
        })),
    updateOne = jest.fn()
        // Сброс пароля (/user/forgot)
        // Успешный сброс - services.user.forgot (setPasswordByEmail) => success
        .mockReturnValueOnce(Promise.resolve({
            upsertedId: user._id,
            result: {
                nModified: 1,
            },
        }))

        // Сброс пароля (/user/forgot)
        // Ошибка в setPasswordByEmail (mongo) - services.user.forgot (setPasswordByEmail) => failed
        .mockReturnValueOnce(Promise.reject(Error('Mongo error (updateOne)')))

        // Сброс пароля (/user/forgot)
        // Ошибка в setPasswordByEmail (nedb) - services.user.forgot (setPasswordByEmail) => success
        .mockReturnValueOnce(Promise.resolve({
            upsertedId: user._id,
            result: {
                nModified: 1,
            },
        }))

        // Сброс пароля (/user/forgot)
        // Отсутствие затронутых записей в БД - services.user.forgot (setPasswordByEmail) => success
        .mockReturnValueOnce(Promise.resolve({
            upsertedId: user._id,
            result: {
                nModified: 0,
            },
        }))

        // Сброс пароля (/user/forgot)
        // Ошибка в sendMail - services.user.forgot (setPasswordByEmail) => success
        .mockReturnValueOnce(Promise.resolve({
            upsertedId: user._id,
            result: {
                nModified: 1,
            },
        })),

    // updateOne = (query, data) => {
    //     if (query._id === 'user.signin@success.test') {
    //         user.sid = data.$set.sid;
    //     }
    //
    //     if (query._id === 'user.signin@mongo.updateone.error.test') {
    //         return Promise.reject(Error('Mongo error (updateOne)'));
    //     }
    //
    //     if (query.email === 'user.forgot@mongo.updateone.error.test') {
    //         return Promise.reject(Error('Mongo error (updateOne)'));
    //     }
    //
    //     if (query.email === 'user.forgot@mongo.updateone.nomodified.test') {
    //         return Promise.resolve({
    //             upsertedId: user._id,
    //             result: {
    //                 nModified: 0,
    //             },
    //         });
    //     }
    //
    //     return Promise.resolve({
    //         upsertedId: user._id,
    //         result: {
    //             nModified: 1,
    //         },
    //     });
    // },
    db = {
        collection() {
            return {
                find,
                insertOne,
                updateOne,
            };
        },
    },
    init = new Promise((resolve) => {
        resolve();
    });

export default db;

export { init };
