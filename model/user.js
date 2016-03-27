/**
 * Модель данных пользователя
 *
 * @module      Model.User
 * @class       Model.User
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


// Объявление модулей
var mongo           = require('../db'),
    Datastore       = require('nedb'),

    // Хранилище пользователей
    usersStore      = new Datastore({ filename: __dirname + '/../store/users.json', autoload: true });


/**
 * Экспорт методов модели данных системы безопастности
 *
 * @method User
 * @param {Object} req Объект запроса сервера
 * @param {Object} res Объект ответа сервера
 * @param {Function} next Следующий слой обработки запроса
 */
module.exports = function (req, res, next) {

    // Инициализация объекта хранилища
    if (!req.hasOwnProperty('store')) {
        req.store = {};
    }

    // Инициализация объекта модели
    if (!req.hasOwnProperty('model')) {
        req.model = {};
    }


    /**
     * Объект хранилища данных
     * интегрированный в объект запроса
     *
     * @attribute store.user 
     * @type Object
     */
    req.store.user = {


        /**
         * Получения пользователя по индексу сессии
         *
         * @method getUserBySession
         * @param {String} index
         * @param {Function} accept
         */
        getUserBySession: function (index, accept) {
            usersStore.findOne({'sid': index}, function (err, user) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                if (typeof accept === 'function') {
                    accept(null, user);
                }
            });
        },


        /**
         * Получения пользователя по Email
         *
         * @method getUserByEmail
         * @param {String} email
         * @param {Function} accept
         */
        getUserByEmail: function (email, accept) {
            usersStore.findOne({'email': email}, function (err, user) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                if (typeof accept === 'function') {
                    accept(null, user);
                }
            });
        },


        /**
         * Получения пользователя по ключу
         *
         * @method getUserByKey
         * @param {String} key
         * @param {Function} accept
         */
        getUserByKey: function (key, accept) {
            usersStore.findOne({'salt': key}, function (err, user) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                if (typeof accept === 'function') {
                    accept(null, user);
                }
            });
        },


        /**
         * Получения пользователя по IP адресу
         *
         * @method getUserByAddress
         * @param {String} address
         * @param {Function} accept
         */
        getUserByAddress: function (address, accept) {
            usersStore.findOne({'address': address}, function (err, user) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                if (typeof accept === 'function') {
                    accept(null, user);
                }
            });
        },


        /**
         * Проверка уникальности по Email
         *
         * @method isExistByEmail
         * @param {String} email
         * @param {Function} accept 
         */
        isExistByEmail: function (email, accept) {
            usersStore.count({'email': email}, function (err, count) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                if (typeof accept === 'function') {
                    accept(null, count);
                }
            });
        },


        /**
         * Создание нового пользователя
         *
         * @method create
         * @param {Object} user
         * @param {Function} accept
         */
        create: function (user, accept) {
            usersStore.insert(user, function (err, user) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                usersStore.loadDatabase();
                if (typeof accept === 'function') {
                    accept(null, user);
                }
            });
        },


        /**
         * Обновление данных пользователя
         *
         * @method update
         * @param {Number} id
         * @param {Object} data
         * @param {Function} accept 
         */
        update: function (id, data, accept) {
            usersStore.update({'_id': id.toString()}, {$set: data}, function (err, result) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                usersStore.loadDatabase();
                if (typeof accept === 'function') {
                    accept(null, result);
                }
            });
        },


        /**
         * Установка хеша текущей сессии для пользователя
         *
         * @method setSession
         * @param {Number} id
         * @param {String} index
         * @param {Function} accept 
         */
        setSession: function (id, index, accept) {
            usersStore.update({'_id': id.toString()}, {$set: {'sid': index}}, function (err, result) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                usersStore.loadDatabase();
                if (typeof accept === 'function') {
                    accept(null, result);
                }
            });
        },


        /**
         * Удаление хеша текущей сессии для пользователя
         *
         * @method unsetSession
         * @param {Number} id
         * @param {Function} accept
         */
        unsetSession: function (id, accept) {
            usersStore.update({'_id': id.toString()}, {$unset: {'sid': true}}, function (err, result) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                usersStore.loadDatabase();
                if (typeof accept === 'function') {
                    accept(null, result);
                }
            });
        },


        /**
         * Установка нового пароля для пользователя
         *
         * @method setPassword
         * @param {Number} id
         * @param {String} password
         * @param {Function} accept
         */
        setPassword: function (id, password, accept) {
            usersStore.update({'_id': id.toString()}, {$set: {'password': password}}, function (err, result) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                usersStore.loadDatabase();
                if (typeof accept === 'function') {
                    accept(null, result);
                }
            });
        },


        /**
         * Установка нового пароля для пользователя по Email
         *
         * @method setPasswordByEmail
         * @param {String} email
         * @param {String} password
         * @param {Function} accept
         */
        setPasswordByEmail: function (email, password, accept) {
            usersStore.update({'email': email}, {$set: {'password': password}}, function (err, result) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                usersStore.loadDatabase();
                if (typeof accept === 'function') {
                    accept(null, result);
                }
            });
        },


        /**
         * Обновление периода действия аккаунта по Email
         *
         * @method updatePeriod
         * @param {Number} id
         * @param {Number} period
         * @param {Function} accept
         */
        updatePeriod: function (id, period, accept) {
            usersStore.update({_id: id.toString()}, {$set: {period: period}}, function (err, result) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                usersStore.loadDatabase();
                if (typeof accept === 'function') {
                    accept(null, result);
                }
            });
        },


        /**
         * Синхронизация данных пользователя в NeDB с MongoDB
         *
         * @method sync
         * @param {Nubber} id
         * @param {Function} accept
         */
        sync: function (id, accept) {
            var period;

            usersStore.findOne({'_id': id.toString()}, function (err, user) {
                if (err) {
                    accept(new Error('NeDB error - ' + err.message));
                    return;
                }

                mongo.db.collection('users', function (err, collection) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    collection.findAndModify({'_id': id}, [['email', 1]], {$set: {
                        'period': user.period
                    }}, {new: true}, function (err, result) {
                        if (err) {
                            accept(new Error('Mongo error - ' + err.message));
                            return;
                        }

                        if (typeof accept === 'function') {
                            accept(null, result);
                        }
                    });
                });
            });
        }
    };


    /**
     * Объект модели данных
     * интегрированный в объект запроса
     *
     * @attribute model.user 
     * @type Object
     */
    req.model.user = {


        /**
         * Получения пользователя по индексу сессии
         *
         * @method getUserBySession
         * @param {String} sid
         * @param {Function} accept
         */
        getUserBySession: function (sid, accept) {
            mongo.db.collection('users', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.findOne({sid: sid}, function (err, user) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    if (typeof accept === 'function') {
                        accept(null, user);
                    }
                });
            });
        },


        /**
         * Получения пользователя по Email
         *
         * @method getUserByEmail
         * @param {String} email
         * @param {Function} accept
         */
        getUserByEmail: function (email, accept) {
            mongo.db.collection('users', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.findOne({'email': email}, function (err, user) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    if (typeof accept === 'function') {
                        accept(null, user);
                    }
                });
            });
        },


        /**
         * Получения пользователя по ключу
         *
         * @method getUserByKey
         * @param {String} key
         * @param {Function} accept
         */
        getUserByKey: function (key, accept) {
            mongo.db.collection('users', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.findOne({'salt': key}, function (err, user) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    if (typeof accept === 'function') {
                        accept(null, user);
                    }
                });
            });
        },


        /**
         * Получения пользователя по IP адресу
         *
         * @method getUserByAddress
         * @param {String} address
         * @param {Function} accept
         */
        getUserByAddress: function (address, accept) {
            mongo.db.collection('users', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.findOne({'address': address}, function (err, user) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    if (typeof accept === 'function') {
                        accept(null, user);
                    }
                });
            });
        },


        /**
         * Проверка уникальности по Email
         *
         * @method isExistByEmail
         * @param {String} email
         * @param {Function} accept 
         */
        isExistByEmail: function (email, accept) {
            mongo.db.collection('users', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.count({'email': email}, function (err, count) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    if (typeof accept === 'function') {
                        accept(null, count);
                    }
                });
            });
        },


        /**
         * Создание нового пользователя
         *
         * @method create
         * @param {Object} user
         * @param {Function} accept
         */
        create: function (user, accept) {
            mongo.db.collection('users', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.insert(user, function (err, user) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    if (typeof accept === 'function') {
                        accept(null, user);
                    }
                });
            });
        },


        /**
         * Обновление данных пользователя
         *
         * @method update
         * @param {Number} id
         * @param {Object} data
         * @param {Function} accept 
         */
        update: function (id, data, accept) {
            mongo.db.collection('users', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.update({'_id': id}, {$set: data}, function (err, result) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    if (typeof accept === 'function') {
                        accept(null, result);
                    }
                });
            });
        },



        /**
         * Установка хеша текущей сессии для пользователя
         *
         * @method setSession
         * @param {Number} id
         * @param {String} sid
         * @param {Function} accept 
         */
        setSession: function (id, sid, accept) {
            mongo.db.collection('users', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.update({'_id': id}, {$set: {'sid': sid}}, function (err, result) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    if (typeof accept === 'function') {
                        accept(null, result);
                    }
                });
            });
        },


        /**
         * Удаление хеша текущей сессии для пользователя
         *
         * @method unsetSession
         * @param {Number} id
         * @param {Function} accept
         */
        unsetSession: function (id, accept) {
            mongo.db.collection('users', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.update({'_id': id}, {$unset: {'sid': true}}, function (err, result) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    if (typeof accept === 'function') {
                        accept(null, result);
                    }
                });
            });
        },


        /**
         * Установка нового пароля для пользователя
         *
         * @method setPassword
         * @param {Number} id
         * @param {String} password
         * @param {Function} accept
         */
        setPassword: function (id, password, accept) {
            mongo.db.collection('users', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.update({'_id': id}, {$set: {password: password}}, function (err, result) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    if (typeof accept === 'function') {
                        accept(null, result);
                    }
                });
            });
        },


        /**
         * Установка нового пароля для пользователя по Email
         *
         * @method setPasswordByEmail
         * @param {String} email
         * @param {String} password
         * @param {Function} accept
         */
        setPasswordByEmail: function (email, password, accept) {
            mongo.db.collection('users', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.update({'email': email}, {$set: {password: password}}, function (err, result) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    if (typeof accept === 'function') {
                        accept(null, result);
                    }
                });
            });
        },


        /**
         * Обновление периода действия аккаунта по Email
         *
         * @method updatePeriod
         * @param {Number} id
         * @param {Number} period
         * @param {Function} accept
         */
        updatePeriod: function (id, period, accept) {
            mongo.db.collection('users', function (err, collection) {
                if (err) {
                    accept(new Error('Mongo error - ' + err.message));
                    return;
                }

                collection.update({'_id': id}, {$set: {period: period}}, function (err, result) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    if (typeof accept === 'function') {
                        accept(null, result);
                    }
                });
            });
        }
    };

    next();
};
