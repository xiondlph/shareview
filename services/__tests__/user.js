/**
 * Тест сервиса управления пользователем
 */

import httpMocks from 'node-mocks-http';
import EventEmitter from 'events';

/* eslint max-len: ["error", 130] */
describe('Тестирование метода create', () => {
    it('Успешное выполнение метода create', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail(email) {
                    expect(email).toEqual('user@simple.com');

                    return new Promise(resolve => {
                        resolve();
                    });
                },

                create(data) {
                    expect(data.email).toEqual('user@simple.com');
                    expect(data.active).toEqual(false);
                    expect(data.address).toEqual('127.0.0.1');
                    expect(data.period).toBeDefined();
                    expect(data.password).toBeDefined();
                    expect(data.salt).toBeDefined();

                    return new Promise(resolve => {
                        resolve({
                            insertedId: 'insertedId',
                        });
                    });
                },
            },
        };

        req.email = (opt) => {
            expect(opt.to).toEqual('user@simple.com');
            expect(opt.subject).toEqual('Регистрация в сервисе SHAREVIEW');
            expect(opt.text).toEqual('Simple text');

            return new Promise(resolve => {
                resolve();
            });
        };

        req.body = {
            email: 'user@simple.com',
        };

        req.ip = '127.0.0.1';
        res.locals = {};

        res.on('render', () => {
            expect(res._getRenderView()).toEqual('mail/register');
            expect(res.locals._id).toEqual('insertedId');
            expect(res.locals.email).toEqual('user@simple.com');
            expect(res.locals.password).toBeDefined();

            res._getRenderData()(null, 'Simple text');
        });

        res.on('send', () => {
            expect(res._getData()).toEqual({ success: true });
            done();
        });

        // Вызов метода create
        user.create(req, res, (err) => {
            expect(err).toEqual(null);
            done();
        });
    });

    it('Выполнение метода create если пользователь авторизован', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        res.locals = {
            user: {}, // Признак авторизированности пользователя
        };

        res.on('send', () => {
            expect(res._getData()).toEqual({ success: false });
            done();
        });

        // Вызов метода create
        user.create(req, res);
    });

    it('Выполнение метода create с ошибкой валидации по email', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.body = {
            email: 'user@simple',
        };

        res.locals = {};

        // Вызов метода create с перехватом исключения
        try {
            user.create(req, res);
        } catch (err) {
            expect(err.message).toEqual('Validate error - mail is invalid');
            done();
        }
    });

    it('Выполнение метода create для существующего пользователя', (done) => {
        const
            user = require('../user').default,
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
                            email: 'user@simple.com',
                        });
                    });
                },
            },
        };

        req.body = {
            email: 'user@simple.com',
        };

        res.locals = {};

        res.on('send', () => {
            expect(res._getData()).toEqual({ success: false, exist: true });
            done();
        });

        // Вызов метода create
        user.create(req, res, (err) => {
            expect(err).toEqual(null);
            done();
        });
    });

    it('Выполнение метода create с ошибкой в вызове "req.model.user.getUserByEmail"', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

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

        // Вызов метода create
        user.create(req, res, (err) => {
            expect(err).toEqual('req.model.user.getUserByEmail.error');
            done();
        });
    });

    it('Выполнение метода create с ошибкой в вызове "req.model.user.create"', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail(email) {
                    expect(email).toEqual('user@simple.com');

                    return new Promise(resolve => {
                        resolve();
                    });
                },

                create(data) {
                    expect(data.email).toEqual('user@simple.com');
                    expect(data.active).toEqual(false);
                    expect(data.address).toEqual('127.0.0.1');
                    expect(data.period).toBeDefined();
                    expect(data.password).toBeDefined();
                    expect(data.salt).toBeDefined();

                    return new Promise((resolve, reject) => {
                        reject('req.model.user.create');
                    });
                },
            },
        };

        req.body = {
            email: 'user@simple.com',
        };

        req.ip = '127.0.0.1';
        res.locals = {};

        // Вызов метода create
        user.create(req, res, (err) => {
            expect(err).toEqual('req.model.user.create');
            done();
        });
    });

    it('Выполнение метода create с ошибкой в вызове "res.render"', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail(email) {
                    expect(email).toEqual('user@simple.com');

                    return new Promise(resolve => {
                        resolve();
                    });
                },

                create(data) {
                    expect(data.email).toEqual('user@simple.com');
                    expect(data.active).toEqual(false);
                    expect(data.address).toEqual('127.0.0.1');
                    expect(data.period).toBeDefined();
                    expect(data.password).toBeDefined();
                    expect(data.salt).toBeDefined();

                    return new Promise(resolve => {
                        resolve({
                            insertedId: 'insertedId',
                        });
                    });
                },
            },
        };

        req.body = {
            email: 'user@simple.com',
        };

        req.ip = '127.0.0.1';
        res.locals = {};

        res.on('render', () => {
            expect(res._getRenderView()).toEqual('mail/register');
            expect(res.locals._id).toEqual('insertedId');
            expect(res.locals.email).toEqual('user@simple.com');
            expect(res.locals.password).toBeDefined();

            res._getRenderData()('res.render.error');
        });

        // Вызов метода create
        user.create(req, res, (err) => {
            expect(err).toEqual('res.render.error');
            done();
        });
    });

    it('Выполнение метода create с ошибкой в вызове "res.email"', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail(email) {
                    expect(email).toEqual('user@simple.com');

                    return new Promise(resolve => {
                        resolve();
                    });
                },

                create(data) {
                    expect(data.email).toEqual('user@simple.com');
                    expect(data.active).toEqual(false);
                    expect(data.address).toEqual('127.0.0.1');
                    expect(data.period).toBeDefined();
                    expect(data.password).toBeDefined();
                    expect(data.salt).toBeDefined();

                    return new Promise(resolve => {
                        resolve({
                            insertedId: 'insertedId',
                        });
                    });
                },
            },
        };

        req.email = (opt) => {
            expect(opt.to).toEqual('user@simple.com');
            expect(opt.subject).toEqual('Регистрация в сервисе SHAREVIEW');
            expect(opt.text).toEqual('Simple text');

            return new Promise((resolve, reject) => {
                reject('req.email.error');
            });
        };

        req.body = {
            email: 'user@simple.com',
        };

        req.ip = '127.0.0.1';
        res.locals = {};

        res.on('render', () => {
            expect(res._getRenderView()).toEqual('mail/register');
            expect(res.locals._id).toEqual('insertedId');
            expect(res.locals.email).toEqual('user@simple.com');
            expect(res.locals.password).toBeDefined();

            res._getRenderData()(null, 'Simple text');
        });

        // Вызов метода create
        user.create(req, res, (err) => {
            expect(err).toEqual('req.email.error');
            done();
        });
    });
});

describe('Тестирование метода forgot', () => {
    it('Успешное выполнение метода forgot', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                setPasswordByEmail(email, pwd) {
                    expect(email).toEqual('user@simple.com');
                    expect(pwd).toBeDefined();

                    return new Promise(resolve => {
                        resolve({
                            mongoResult: {
                                result: {
                                    nModified: 1,
                                },
                            },
                        });
                    });
                },
            },
        };

        req.email = (opt) => {
            expect(opt.to).toEqual('user@simple.com');
            expect(opt.subject).toEqual('Востановления доступа к сервису SHAREVIEW');
            expect(opt.text).toEqual('Simple text');

            return new Promise(resolve => {
                resolve();
            });
        };

        req.body = {
            email: 'user@simple.com',
        };

        res.locals = {};

        res.on('render', () => {
            expect(res._getRenderView()).toEqual('mail/forgot');
            expect(res.locals.password).toBeDefined();

            res._getRenderData()(null, 'Simple text');
        });

        res.on('send', () => {
            expect(res._getData()).toEqual({ success: true });
            done();
        });

        // Вызов метода forgot
        user.forgot(req, res, (err) => {
            expect(err).toEqual(null);
            done();
        });
    });

    it('Выполнение метода forgot если пользователь авторизован', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        res.locals = {
            user: {}, // Признак авторизированности пользователя
        };

        res.on('send', () => {
            expect(res._getData()).toEqual({ success: false });
            done();
        });

        // Вызов метода create
        user.forgot(req, res);
    });

    it('Выполнение метода forgot с ошибкой валидации по email', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.body = {
            email: 'user@simple',
        };

        res.locals = {};

        // Вызов метода forgot с перехватом исключения
        try {
            user.forgot(req, res);
        } catch (err) {
            expect(err.message).toEqual('Validate error - mail is invalid');
            done();
        }
    });

    it('Выполнение метода forgot с ошибкой в вызове "req.model.user.setPasswordByEmail"', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                setPasswordByEmail(email) {
                    expect(email).toEqual('user@simple.com');

                    return new Promise((resolve, reject) => {
                        reject('req.model.user.setPasswordByEmail.error');
                    });
                },
            },
        };

        req.body = {
            email: 'user@simple.com',
        };

        res.locals = {};

        // Вызов метода forgot
        user.forgot(req, res, (err) => {
            expect(err).toEqual('req.model.user.setPasswordByEmail.error');
            done();
        });
    });

    it('Выполнение метода forgot с ошибкой в вызове "res.render"', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                setPasswordByEmail(email, pwd) {
                    expect(email).toEqual('user@simple.com');
                    expect(pwd).toBeDefined();

                    return new Promise(resolve => {
                        resolve({
                            mongoResult: {
                                result: {
                                    nModified: 1,
                                },
                            },
                        });
                    });
                },
            },
        };

        req.body = {
            email: 'user@simple.com',
        };

        res.locals = {};

        res.on('render', () => {
            expect(res._getRenderView()).toEqual('mail/forgot');
            expect(res.locals.password).toBeDefined();

            res._getRenderData()('res.render.error');
        });

        // Вызов метода forgot
        user.forgot(req, res, (err) => {
            expect(err).toEqual('res.render.error');
            done();
        });
    });

    it('Выполнение метода forgot с ошибкой в вызове "res.email', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                setPasswordByEmail(email, pwd) {
                    expect(email).toEqual('user@simple.com');
                    expect(pwd).toBeDefined();

                    return new Promise(resolve => {
                        resolve({
                            mongoResult: {
                                result: {
                                    nModified: 1,
                                },
                            },
                        });
                    });
                },
            },
        };

        req.email = (opt) => {
            expect(opt.to).toEqual('user@simple.com');
            expect(opt.subject).toEqual('Востановления доступа к сервису SHAREVIEW');
            expect(opt.text).toEqual('Simple text');

            return new Promise((resolve, reject) => {
                reject('req.email.error');
            });
        };

        req.body = {
            email: 'user@simple.com',
        };

        res.locals = {};

        res.on('render', () => {
            expect(res._getRenderView()).toEqual('mail/forgot');
            expect(res.locals.password).toBeDefined();

            res._getRenderData()(null, 'Simple text');
        });

        res.on('send', () => {
            expect(res._getData()).toEqual({ success: true });
            done();
        });

        // Вызов метода forgot
        user.forgot(req, res, (err) => {
            expect(err).toEqual('req.email.error');
            done();
        });
    });
});
