/**
 * Модель данных пользователя
 *
 * @module      Model.User
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
import Nedb from 'nedb';
import db from '../db';

const

    // Хранилище пользователей
    store = new Nedb({ filename: __dirname + '/../store/users.json', autoload: true }),

    /**
     * Экспорт методов модели данных системы безопастности
     *
     * @method User
     * @param {Object} req - Объект запроса сервера
     * @param {Object} res - Объект ответа сервера
     * @param {Function} next - Следующий слой обработки запроса
     */
    user = (req, res, next) => {

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
             * Получения пользователя по ключу
             *
             * @method getUserByKey
             * @param {String} key
             * @param {Function} accept
             */
            getUserByKey: function (key, accept) {
                store.findOne({'salt': key}, function (err, user) {
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
                store.findOne({'address': address}, function (err, user) {
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
             * Создание нового пользователя
             *
             * @method create
             * @param {Object} user
             * @param {Function} accept
             */
            create: function (user, accept) {
                var data = {
                    '_id':      user._id.toString(),
                    'salt':     user.salt,
                    'email':    user.email,
                    'address':  user.address,
                    'period':   user.period
                };

                store.insert(data, function (err, user) {
                    if (err) {
                        accept(new Error('NeDB error - ' + err.message));
                        return;
                    }

                    store.loadDatabase();
                    if (typeof accept === 'function') {
                        accept(null, user);
                    }
                });
            },


            /**
             * Обновление периода действия аккаунта по id
             *
             * @method updatePeriod
             * @param {Number} id
             * @param {Number} period
             * @param {Function} accept
             */
            updatePeriod: function (id, period, accept) {
                store.update({_id: id.toString()}, {$set: {period: period}}, function (err, result) {
                    if (err) {
                        accept(new Error('NeDB error - ' + err.message));
                        return;
                    }

                    store.loadDatabase();
                    if (typeof accept === 'function') {
                        accept(null, result);
                    }
                });
            },


            /**
             * Синхронизация данных пользователя в MongoDB с NeDB
             *
             * @method sync
             * @param {Nubber} id
             * @param {Function} accept
             */
            sync: function (id, accept) {
                store.findOne({'_id': id.toString()}, function (err, user) {
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
             * Получения пользователя по id
             *
             * @method getUserById
             * @param {Number} id
             * @param {Function} accept
             */
            getUserById: function (id, accept) {
                db.collection('users', function (err, collection) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    collection.findOne({'_id': id}, function (err, user) {
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
             * Получения пользователя по индексу сессии
             *
             * @method getUserBySession
             * @param {String} sid
             * @param {Function} accept
             */
            getUserBySession: function (sid, accept) {
                db.collection('users', function (err, collection) {
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
                db.collection('users', function (err, collection) {
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
                db.collection('users', function (err, collection) {
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
                db.collection('users', function (err, collection) {
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
                db.collection('users', function (err, collection) {
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
                db.collection('users', function (err, collection) {
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
                db.collection('users', function (err, collection) {
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
             * Установка хеша текущей сессии для пользователя по id
             *
             * @method setSessionById
             * @param {Number} id
             * @param {String} sid
             * @param {Function} accept
             */
            setSessionById: function (id, sid, accept) {
                db.collection('users', function (err, collection) {
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
             * Удаление хеша текущей сессии для пользователя по id
             *
             * @method unsetSessionById
             * @param {Number} id
             * @param {Function} accept
             */
            unsetSessionById: function (id, accept) {
                db.collection('users', function (err, collection) {
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
             * Установка нового пароля для пользователя по id
             *
             * @method setPasswordId
             * @param {Number} id
             * @param {String} password
             * @param {Function} accept
             */
            setPasswordId: function (id, password, accept) {
                db.collection('users', function (err, collection) {
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
                db.collection('users', function (err, collection) {
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
                db.collection('users', function (err, collection) {
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
            },


            /**
             * Синхронизация данных пользователя в NeDB с MongoDB
             *
             * @method sync
             * @param {Number} id
             * @param {Function} accept
             */
            sync: function (id, accept) {
                db.collection('users', function (err, collection) {
                    if (err) {
                        accept(new Error('Mongo error - ' + err.message));
                        return;
                    }

                    collection.findOne({'_id': id}, function (err, user) {
                        if (err) {
                            accept(new Error('Mongo error - ' + err.message));
                            return;
                        }

                        store.update({'_id': id.toString()}, {$set: {
                            'salt':     user.salt,
                            'email':    user.email,
                            'address':  user.address,
                            'period':   user.period
                        }}, {}, function (err, result) {
                            if (err) {
                                accept(new Error('Store error - ' + err.message));
                                return;
                            }

                            store.loadDatabase();
                            if (typeof accept === 'function') {
                                accept(null, result);
                            }
                        });
                    });
                });
            }
        };

        next();
    };

export default user;