/**
 * Тест сервиса управления пользователем
 */

import httpMocks from 'node-mocks-http';
import EventEmitter from 'events';

/* eslint max-len: ["error", 130] */
describe('Тестирование метода create', () => {
    it('Успешное выполнение метода create', () => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail(email) {
                    expect(email).toBe('fake@user.com');

                    return new Promise(resolve => {
                        resolve();
                    });
                },

                create(data) {
                    expect(data).toHaveProperty('email', 'fake@user.com');
                    expect(data).toHaveProperty('active', false);
                    expect(data).toHaveProperty('address', '127.0.0.1');
                    expect(data).toHaveProperty('period');
                    expect(data).toHaveProperty('password');
                    expect(data).toHaveProperty('salt');

                    return new Promise(resolve => {
                        resolve({ insertedId: 'fake.inserted.id' });
                    });
                },
            },
        };

        req.email = (opt) => {
            expect(opt).toHaveProperty('to', 'fake@user.com');
            expect(opt).toHaveProperty('subject', 'Регистрация в сервисе SHAREVIEW');
            expect(opt).toHaveProperty('text', 'Simple text');

            return new Promise(resolve => {
                resolve();
            });
        };

        req.body = {
            email: 'fake@user.com',
        };

        req.ip = '127.0.0.1';
        res.locals = {};

        res.on('render', () => {
            expect(res._getRenderView()).toBe('mail/register');
            expect(res).toHaveProperty('locals._id', 'fake.inserted.id');
            expect(res).toHaveProperty('locals.email', 'fake@user.com');
            expect(res).toHaveProperty('locals.password');

            res._getRenderData()(null, 'Simple text');
        });

        return new Promise((resolve, reject) => {
            res.on('send', () => {
                expect(res._getData()).toEqual({ success: true });
                resolve();
            });

            // Вызов метода create
            user.create(req, res, err => {
                reject(err);
            });
        });
    });

    it('Выполнение метода create если пользователь авторизован', done => {
        const
            user = require('../user').default,
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
            expect(res._getData()).toEqual({ success: false });
            done();
        });

        // Вызов метода create
        user.create(req, res);
    });

    it('Выполнение метода create с ошибкой валидации по email', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.body = {
            email: 'fake.invalid.user.email',
        };

        res.locals = {};

        // Вызов метода create с перехватом исключения
        user.create(req, res, err => {
            expect(err).toEqual(Error('Validate error - email is invalid'));
            done();
        });
    });

    it('Выполнение метода create для существующего пользователя', () => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail() {
                    return new Promise(resolve => {
                        resolve({
                            email: 'fake@user.com',
                        });
                    });
                },
            },
        };

        req.body = {
            email: 'fake@user.com',
        };

        res.locals = {};

        return new Promise((resolve, reject) => {
            res.on('send', () => {
                expect(res._getData()).toEqual({ success: false, exist: true });
                resolve();
            });

            // Вызов метода create
            user.create(req, res, err => {
                reject(err);
            });
        });

    });

    it('Выполнение метода create с ошибкой в вызове "req.model.user.getUserByEmail"', () => {
        const
            user = require('../user').default,
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
            // Вызов метода create
            user.create(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('req.model.user.getUserByEmail.error'));
        });
    });

    it('Выполнение метода create с ошибкой в вызове "req.model.user.create"', () => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserByEmail() {
                    return new Promise(resolve => {
                        resolve();
                    });
                },

                create() {
                    return new Promise((resolve, reject) => {
                        reject(Error('req.model.user.create'));
                    });
                },
            },
        };

        req.body = {
            email: 'fake@user.com',
        };

        res.locals = {};

        return new Promise((resolve, reject) => {
            // Вызов метода create
            user.create(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('req.model.user.create'));
        });
    });

    it('Выполнение метода create с ошибкой в вызове "res.render"', () => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail() {
                    return new Promise(resolve => {
                        resolve();
                    });
                },

                create() {
                    return new Promise(resolve => {
                        resolve({
                            insertedId: 'fake.inserted.id',
                        });
                    });
                },
            },
        };

        req.body = {
            email: 'fake@user.com',
        };

        res.locals = {};

        res.on('render', () => {
            res._getRenderData()(Error('res.render.error'));
        });

        return new Promise((resolve, reject) => {
            // Вызов метода create
            user.create(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('res.render.error'));
        });
    });

    it('Выполнение метода create с ошибкой в вызове "reg.email"', () => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail() {
                    return new Promise(resolve => {
                        resolve();
                    });
                },

                create() {
                    return new Promise(resolve => {
                        resolve({
                            insertedId: 'fake.inserted.id',
                        });
                    });
                },
            },
        };

        req.email = () => {
            return new Promise((resolve, reject) => {
                reject(Error('req.email.error'));
            });
        };

        req.body = {
            email: 'fake@user.com',
        };

        res.locals = {};

        res.on('render', () => {
            res._getRenderData()(null, 'Simple text');
        });

        return new Promise((resolve, reject) => {
            // Вызов метода create
            user.create(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('req.email.error'));
        });
    });
});

describe('Тестирование метода forgot', () => {
    it('Успешное выполнение метода forgot', () => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                setPasswordByEmail(email, pwd) {
                    expect(email).toEqual('fake@user.com');
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
            expect(opt).toHaveProperty('to', 'fake@user.com');
            expect(opt).toHaveProperty('subject', 'Востановления доступа к сервису SHAREVIEW');
            expect(opt).toHaveProperty('text', 'Simple text');

            return new Promise(resolve => {
                resolve();
            });
        };

        req.body = {
            email: 'fake@user.com',
        };

        res.locals = {};

        res.on('render', () => {
            expect(res._getRenderView()).toBe('mail/forgot');
            expect(res).toHaveProperty('locals.password');

            res._getRenderData()(null, 'Simple text');
        });

        return new Promise((resolve, reject) => {
            res.on('send', () => {
                expect(res._getData()).toEqual({ success: true });
                resolve();
            });

            // Вызов метода forgot
            user.forgot(req, res, err => {
                reject(err);
            });
        });
    });

    it('Выполнение метода forgot если пользователь авторизован', done => {
        const
            user = require('../user').default,
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
            expect(res._getData()).toEqual({ success: false });
            done();
        });

        // Вызов метода create
        user.forgot(req, res);
    });

    it('Выполнение метода forgot с ошибкой валидации по email', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.body = {
            email: 'fake.invalid.user.email',
        };

        res.locals = {};

        // Вызов метода create с перехватом исключения
        user.create(req, res, err => {
            expect(err).toEqual(Error('Validate error - email is invalid'));
            done();
        });
    });

    it('Выполнение метода forgot с ошибкой в вызове "req.model.user.setPasswordByEmail"', () => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                setPasswordByEmail() {
                    return new Promise((resolve, reject) => {
                        reject(Error('req.model.user.setPasswordByEmail.error'));
                    });
                },
            },
        };

        req.body = {
            email: 'fake@user.com',
        };

        res.locals = {};

        return new Promise((resolve, reject) => {
            // Вызов метода forgot
            user.forgot(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('req.model.user.setPasswordByEmail.error'));
        });
    });

    it('Выполнение метода forgot с ошибкой в вызове "res.render"', () => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                setPasswordByEmail() {
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
            email: 'fake@user.com',
        };

        res.locals = {};

        res.on('render', () => {
            res._getRenderData()(Error('res.render.error'));
        });

        return new Promise((resolve, reject) => {
            // Вызов метода forgot
            user.forgot(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('res.render.error'));
        });
    });

    it('Выполнение метода forgot с ошибкой в вызове "reg.email', () => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                setPasswordByEmail() {
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

        req.email = () => {
            return new Promise((resolve, reject) => {
                reject(Error('req.email.error'));
            });
        };

        req.body = {
            email: 'fake@user.com',
        };

        res.locals = {};

        res.on('render', () => {
            res._getRenderData()(null, 'Simple text');
        });

        return new Promise((resolve, reject) => {
            // Вызов метода forgot
            user.forgot(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('req.email.error'));
        });
    });
});
