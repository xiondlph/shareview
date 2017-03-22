/**
 * Тест сервиса системы безопасности
 */

import httpMocks from 'node-mocks-http';
import EventEmitter from 'events';

/* eslint max-len: ["error", 130] */
describe('Тестирование метода user', () => {
    it('Успешное выполнение метода user', (done) => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserBySession(sessionId) {
                    expect(sessionId).toEqual('sessionId');

                    return new Promise(resolve => {
                        resolve('user'); // Признак авторизированности пользователя
                    });
                },
            },
        };

        req.session = {
            id: 'sessionId',
        };

        res.locals = {};

        // Вызов метода user
        secure.user(req, res, (err) => {
            expect(err).toBeUndefined();
            expect(res.locals).toEqual({ user: 'user' });

            done();
        });
    });

    it('Выполнение метода user с ошибкой в вызове "req.model.user.getUserBySession"', (done) => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserBySession(sessionId) {
                    expect(sessionId).toEqual('sessionId');

                    return new Promise((resolve, reject) => {
                        reject('req.model.user.getUserBySession.error');
                    });
                },
            },
        };

        req.session = {
            id: 'sessionId',
        };

        res.locals = {};

        // Вызов метода user
        secure.user(req, res, (err) => {
            expect(err).toEqual('req.model.user.getUserBySession.error');

            done();
        });
    });
});

describe('Тестирование метода auth', () => {
    it('Выполнение метода auth для авторизированного пользователя', (done) => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        res.locals = {
            user: 'user', // Признак авторизированности пользователя
        };

        // Вызов метода auth
        secure.auth(req, res, () => {
            done();
        });
    });

    it('Выполнение метода auth для неавторизированного пользователя', (done) => {
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
    it('Успешное выполнение метода signin', (done) => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail(email) {
                    expect(email).toEqual('user@simple.com');

                    return new Promise(resolve => {
                        resolve({
                            _id: '_id',

                            // Захешеный "password"
                            password: 'e56a207acd1e6714735487c199c6f095844b7cc8e5971d86c003a7b6f36ef51e',

                            email: 'email',
                            address: 'address',
                            salt: 'salt',
                            period: 'period',
                        });
                    });
                },

                setSessionById(_id, sessionId) {
                    expect(_id).toEqual('_id');
                    expect(sessionId).toEqual('sessionId');

                    return new Promise(resolve => {
                        resolve();
                    });
                },
            },
        };

        req.session = {
            id: 'sessionId',
        };

        req.body = {
            email: 'user@simple.com',
            password: 'password',
        };

        res.locals = {};

        res.on('send', () => {
            expect(res._getData()).toEqual({
                success: true,
                profile: {
                    email: 'email',
                    address: 'address',
                    key: 'salt',
                    period: 'period',
                },
            });

            done();
        });

        // Вызов метода user
        secure.signin(req, res, (err) => {
            expect(err).toEqual(null);
            done();
        });
    });

    it('Выполнение метода signin если пользователь авторизован', (done) => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        res.locals = {
            user: 'user', // Признак авторизированности пользователя
        };

        res.on('send', () => {
            expect(res._getData()).toEqual({ success: true });
            done();
        });

        // Вызов метода user
        secure.signin(req, res);
    });

    it('Выполнение метода signin с ошибкой валидации по email', (done) => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.body = {
            email: 'user@simple',
        };

        res.locals = {};

        // Вызов метода signin с перехватом исключения
        try {
            secure.signin(req, res);
        } catch (err) {
            expect(err.message).toEqual('Validate error - mail is invalid');
            done();
        }
    });

    it('Выполнение метода signin с ошибкой в вызове "req.model.user.getUserByEmail"', (done) => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserByEmail(email) {
                    expect(email).toEqual('user@simple.com');

                    return new Promise((resolve, reject) => {
                        reject('req.model.user.getUserByEmail.error');
                    });
                },
            },
        };

        req.body = {
            email: 'user@simple.com',
        };

        res.locals = {};

        // Вызов метода signin
        secure.signin(req, res, (err) => {
            expect(err).toEqual('req.model.user.getUserByEmail.error');
            done();
        });
    });

    it('Выполнение метода signin с ошибкой в вызове "req.model.user.setSessionById"', (done) => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserByEmail(email) {
                    expect(email).toEqual('user@simple.com');

                    return new Promise(resolve => {
                        resolve({
                            _id: '_id',

                            // Захешеный "password"
                            password: 'e56a207acd1e6714735487c199c6f095844b7cc8e5971d86c003a7b6f36ef51e',

                            email: 'email',
                            address: 'address',
                            salt: 'salt',
                            period: 'period',
                        });
                    });
                },

                setSessionById(_id, sessionId) {
                    expect(_id).toEqual('_id');
                    expect(sessionId).toEqual('sessionId');

                    return new Promise((resolve, reject) => {
                        reject('req.model.user.setSessionById.error');
                    });
                },
            },
        };

        req.session = {
            id: 'sessionId',
        };

        req.body = {
            email: 'user@simple.com',
            password: 'password',
        };

        res.locals = {};

        // Вызов метода user
        secure.signin(req, res, (err) => {
            expect(err).toEqual('req.model.user.setSessionById.error');
            done();
        });
    });
});
