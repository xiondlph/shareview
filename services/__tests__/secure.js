/**
 * Тест сервиса системы безопасности
 */

import httpMocks from 'node-mocks-http';
import EventEmitter from 'events';

/* eslint max-len: ["error", 130] */
describe('Тестирование метода user', () => {
    it('Успешное выполнение метода user', done => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserBySession(sessionId) {
                    expect(sessionId).toEqual('fake.session.id');

                    return {
                        then(cb) {
                            // Признак авторизированности пользователя
                            cb({
                                email: 'fake@user.com',
                            });
                        },
                    };
                },
            },
        };

        req.session = {
            id: 'fake.session.id',
        };

        res.locals = {};

        // Вызов метода user
        secure.user(req, res, () => {
            expect(res.locals).toEqual({ user: { email: 'fake@user.com' } });

            done();
        });
    });

    it('Выполнение метода user с ошибкой в вызове "req.model.user.getUserBySession"', done => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserBySession() {
                    return new Promise((resolve, reject) => {
                        reject(Error('req.model.user.getUserBySession.error'));
                    });
                },
            },
        };

        req.session = {
            id: 'fake.session.id',
        };

        // Вызов метода user
        secure.user(req, res, err => {
            expect(err).toEqual(Error('req.model.user.getUserBySession.error'));

            done();
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
    it('Успешное выполнение метода signin', done => {
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

                    return {
                        then(cb) {
                            cb({
                                _id: 'fake_id',

                                // Захешеный "fake.password"
                                password: 'cf1a63230b18ca6299394958b885096d0fe86c85b3870364706d488e57788e4a',

                                email: 'fake.email',
                                address: 'fake.address',
                                salt: 'fake.salt',
                                period: 'fake.period',
                            });
                        },
                    };
                },

                setSessionById(_id, sessionId) {
                    expect(_id).toEqual('fake_id');
                    expect(sessionId).toEqual('fake.session.id');

                    return {
                        then(cb) { cb(); },
                    };
                },
            },
        };

        req.session = {
            id: 'fake.session.id',
        };

        req.body = {
            email: 'fake@user.com',
            password: 'fake.password',
        };

        res.locals = {};

        res.on('send', () => {
            expect(res._getData()).toEqual({
                success: true,
                profile: {
                    email: 'fake.email',
                    address: 'fake.address',
                    key: 'fake.salt',
                    period: 'fake.period',
                },
            });

            done();
        });

        // Вызов метода user
        secure.signin(req, res);
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

    it('Выполнение метода signin с ошибкой валидации по email', () => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.body = {
            email: 'fake.invalid.user.email',
        };

        res.locals = {};

        // Вызов метода create с перехватом исключения
        expect(() => {
            secure.signin(req, res);
        }).toThrow('Validate error - mail is invalid');
    });

    it('Выполнение метода signin с ошибкой в вызове "req.model.user.getUserByEmail"', done => {
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

        // Вызов метода signin
        secure.signin(req, res, err => {
            expect(err).toEqual(Error('req.model.user.getUserByEmail.error'));
            done();
        });
    });

    it('Выполнение метода signin с ошибкой в вызове "req.model.user.setSessionById"', done => {
        const
            secure = require('../secure').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserByEmail() {
                    return new Promise(resolve => {
                        resolve({
                            _id: 'fake_id',

                            // Захешеный "fake.password"
                            password: 'cf1a63230b18ca6299394958b885096d0fe86c85b3870364706d488e57788e4a',

                            email: 'fake.email',
                            address: 'fake.address',
                            salt: 'fake.salt',
                            period: 'fake.period',
                        });
                    });
                },

                setSessionById() {
                    return new Promise((resolve, reject) => {
                        reject(Error('req.model.user.setSessionById.error'));
                    });
                },
            },
        };

        req.session = {
            id: 'fake.session.id',
        };

        req.body = {
            email: 'fake@user.com',
            password: 'fake.password',
        };

        res.locals = {};

        // Вызов метода user
        secure.signin(req, res, err => {
            expect(err).toEqual(Error('req.model.user.setSessionById.error'));
            done();
        });
    });
});
