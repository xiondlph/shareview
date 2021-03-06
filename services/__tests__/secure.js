/**
 * Тест сервиса системы безопасности
 */

import httpMocks from 'node-mocks-http';
import EventEmitter from 'events';

jest.mock('jsonwebtoken');

/* eslint max-len: ["error", 130] */
describe('Тестирование метода user', () => {
    it('Успешное выполнение метода user', () => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserById(objectID) {
                    expect(objectID).toEqual({ objectid: 'fake._id' });

                    return new Promise(resolve => {
                        // Признак авторизированности пользователя
                        resolve({
                            email: 'fake@user.com',
                        });
                    });
                },
            },
        };

        req.body.token = 'fake.token.success';

        res.locals = {};

        return new Promise(resolve => {
            // Вызов метода user
            secure.user(req, res, () => {
                resolve();
            });
        }).then(() => {
            expect(res.locals).toEqual({ user: { email: 'fake@user.com' } });
        });
    });

    it('Выполнение метода user с ошибкой в вызове "req.model.user.getUserById"', () => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserById() {
                    return new Promise((resolve, reject) => {
                        reject(Error('req.model.user.getUserById.error'));
                    });
                },
            },
        };

        req.body.token = 'fake.token.success';

        return new Promise((resolve, reject) => {
            // Вызов метода user
            secure.user(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('req.model.user.getUserById.error'));
        });
    });
});

describe('Тестирование метода auth', () => {
    it('Выполнение метода auth для авторизированного пользователя', done => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        res.locals = {

            // Признак авторизированности пользователя
            user: {
                email: 'fake@user.com',
            },
        };

        // Вызов метода auth
        secure.auth(req, res, () => {
            done();
        });
    });

    it('Выполнение метода auth для неавторизированного пользователя', done => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        res.locals = {};

        res.on('send', () => {
            expect(res._getData()).toEqual({ errors: ['Forbidden resource'] });
            expect(res.statusCode).toBe(403);
            done();
        });

        // Вызов метода auth
        secure.auth(req, res);
    });
});

describe('Тестирование метода signin', () => {
    it('Успешное выполнение метода signin', () => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail(email) {
                    expect(email).toEqual('fake@user.com');

                    return new Promise(resolve => {
                        resolve({
                            _id: 'fake_id',

                            // Захешеный "fake.password"
                            password: 'cf1a63230b18ca6299394958b885096d0fe86c85b3870364706d488e57788e4a',

                            email: 'fake.email',
                            address: 'fake.address',
                            salt: 'fake.salt',
                        });
                    });
                },
            },
        };

        req.body = {
            email: 'fake@user.com',
            password: 'fake.password',
        };

        res.locals = {};

        return new Promise((resolve, reject) => {
            res.on('send', () => {
                expect(res._getData()).toEqual({
                    success: true,
                    token: 'fake.token.success',
                    profile: {
                        email: 'fake.email',
                        address: 'fake.address',
                        key: 'fake.salt',
                    },
                });

                resolve();
            });

            // Вызов метода user
            secure.signin(req, res, err => {
                reject(err);
            });
        });
    });

    it('Выполнение метода signin если пользователь авторизован', done => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        res.locals = {

            // Признак авторизированности пользователя
            user: {
                email: 'fake@user.com',
            },
        };

        res.on('send', () => {
            expect(res._getData()).toEqual({ success: true });
            done();
        });

        // Вызов метода user
        secure.signin(req, res);
    });

    it('Выполнение метода signin с ошибкой валидации по email', done => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.body = {
            email: 'fake.invalid.user.email',
        };

        res.locals = {};

        // Вызов метода create с перехватом исключения
        secure.signin(req, res, err => {
            expect(err).toEqual(Error('Validate error - email is invalid'));
            done();
        });
    });

    it('Выполнение метода signin с ошибкой в вызове "req.model.user.getUserByEmail"', () => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserByEmail() {
                    return new Promise((resolve, reject) => {
                        reject(Error('req.model.user.getUserByEmail.error'));
                    });
                },
            },
        };

        req.body = {
            email: 'fake@user.com',
        };

        res.locals = {};

        return new Promise((resolve, reject) => {
            // Вызов метода signin
            secure.signin(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('req.model.user.getUserByEmail.error'));
        });
    });
});

describe('Тестирование метода access', () => {
    it('Успешное выполнение метода access', () => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserBySaltAndAddress(salt, address) {
                    expect(salt).toBe('fake.salt');
                    expect(address).toBe('fake.address');

                    return new Promise(resolve => {
                        resolve({
                            email: 'fake@user.com',
                        });
                    });
                },
            },
        };

        req.headers['x-ismax-key'] = 'fake.salt';
        req.ip = 'fake.address';

        res.locals = {};

        return new Promise(resolve => {
            // Вызов метода access
            secure.access(req, res, () => {
                resolve();
            });
        }).then(() => {
            expect(res.locals).toEqual({ user: { email: 'fake@user.com' } });
        });
    });

    it('Выполнение метода access с ошибкой в вызове "req.model.user.getUserBySaltAndAddress"', () => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserBySaltAndAddress() {
                    return new Promise((resolve, reject) => {
                        reject(Error('req.model.user.getUserBySaltAndAddress.error'));
                    });
                },
            },
        };

        req.headers['x-ismax-key'] = 'fake.salt';
        req.ip = 'fake.address';

        res.locals = {};

        return new Promise((resolve, reject) => {
            // Вызов метода access
            secure.access(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('req.model.user.getUserBySaltAndAddress.error'));
        });
    });

    it('Выполнение метода access с отсутствием доступа', done => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserBySaltAndAddress() {
                    return new Promise(resolve => {
                        resolve(null);
                    });
                },
            },
        };

        req.headers['x-ismax-key'] = 'fake.salt';
        req.ip = 'fake.address';

        res.on('send', () => {
            expect(res._getData()).toEqual({ errors: ['Access denied. Client ip: fake.address'] });
            expect(res.statusCode).toBe(403);
            done();
        });

        // Вызов метода access
        secure.access(req, res);
    });
});
