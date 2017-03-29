/**
 * Тест сервиса управления профилем
 */

import httpMocks from 'node-mocks-http';
import EventEmitter from 'events';

describe('Тестирование метода get', () => {
    it('Успешное выполнение метода get', done => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        res.locals = {
            user: {
                email: 'fake.email',
                address: 'fake.address',
                salt: 'fake.key',
                period: 'fake.period',
            },
        };

        res.on('send', () => {
            expect(res._getData()).toEqual({
                success: true,
                profile: {
                    email: 'fake.email',
                    address: 'fake.address',
                    key: 'fake.key',
                    period: 'fake.period',
                },
            });
            done();
        });

        // Вызов метода get
        profile.get(req, res);
    });
});

describe('Тестирование метода set', () => {
    it('Успешное выполнение метода set', () => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail(email) {
                    expect(email).toBe('fake@email.com');

                    return new Promise(resolve => {
                        resolve(null);
                    });
                },

                update(_id, data) {
                    expect(_id).toBe('fake._id');
                    expect(data).toHaveProperty('email', 'fake@email.com');
                    expect(data).toHaveProperty('address', '127.0.0.1');

                    return new Promise(resolve => {
                        resolve();
                    });
                },
            },
        };

        req.body = {
            email: 'fake@email.com',
            address: '127.0.0.1',
        };

        res.locals = {
            user: {
                _id: 'fake._id',
                email: 'fake@user.com',
            },
        };

        return new Promise((resolve, reject) => {
            res.on('send', () => {
                expect(res._getData()).toEqual({ success: true });
                resolve();
            });

            // Вызов метода set
            profile.set(req, res, err => {
                reject(err);
            });
        });
    });

    it('Выполнение метода set с передачей для сохранения только IP адрес', () => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                update(_id, data) {
                    expect(data).toEqual({ address: '127.0.0.1' });

                    return new Promise(resolve => {
                        resolve();
                    });
                },
            },
        };

        req.body = {
            address: '127.0.0.1',
        };

        res.locals = {
            user: {
                _id: 'fake._id',
            },
        };

        return new Promise((resolve, reject) => {
            res.on('send', () => {
                expect(res._getData()).toEqual({ success: true });
                resolve();
            });

            // Вызов метода set
            profile.set(req, res, err => {
                reject(err);
            });
        });
    });

    it('Выполнение метода set с ошибкой валидации по IP адресу', done => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.body = {
            address: 'fake.invalid.ip',
        };

        // Вызов метода set
        profile.set(req, res, err => {
            expect(err).toEqual(Error('Validate error - address is invalid'));
            done();
        });
    });

    it('Выполнение метода set с передачей для сохранения только Email', () => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail() {
                    return new Promise(resolve => {
                        resolve(null);
                    });
                },

                update(_id, data) {
                    expect(data).toEqual({ email: 'fake@email.com' });

                    return new Promise(resolve => {
                        resolve();
                    });
                },
            },
        };

        req.body = {
            email: 'fake@email.com',
        };

        res.locals = {
            user: {
                _id: 'fake._id',
                email: 'fake@user.com',
            },
        };

        return new Promise((resolve, reject) => {
            res.on('send', () => {
                expect(res._getData()).toEqual({ success: true });
                resolve();
            });

            // Вызов метода set
            profile.set(req, res, err => {
                reject(err);
            });
        });
    });

    it('Выполнение метода set с ошибкой валидации по Email', done => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.body = {
            email: 'fake.invalid.email',
            address: '127.0.0.1',
        };

        // Вызов метода set
        profile.set(req, res, err => {
            expect(err).toEqual(Error('Validate error - email is invalid'));
            done();
        });
    });

    it('Выполнение метода set в ситуации если пользователь с таким Email уже есть', () => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail(email) {
                    return new Promise(resolve => {
                        resolve({
                            email,
                        });
                    });
                },
            },
        };

        req.body = {
            email: 'fake@email.com',
            address: '127.0.0.1',
        };

        res.locals = {
            user: {
                email: 'fake@user.com',
            },
        };

        return new Promise((resolve, reject) => {
            res.on('send', () => {
                expect(res._getData()).toEqual({ exist: true, success: false });
                resolve();
            });

            // Вызов метода set
            profile.set(req, res, err => {
                reject(err);
            });
        });
    });

    it('Выполнение метода set с ошибкой в вызове isExistByEmail', () => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserByEmail() {
                    return new Promise((resolve, reject) => {
                        reject(Error('isExistByEmail.error'));
                    });
                },
            },
        };

        req.body = {
            email: 'fake@email.com',
            address: '127.0.0.1',
        };

        return new Promise((resolve, reject) => {
            // Вызов метода set
            profile.set(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('isExistByEmail.error'));
        });
    });

    it('Выполнение метода set с ошибкой в вызове updateProfile', () => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                getUserByEmail() {
                    return new Promise(resolve => {
                        resolve(null);
                    });
                },

                update() {
                    return new Promise((resolve, reject) => {
                        reject(Error('updateProfile.error'));
                    });
                },
            },
        };

        req.body = {
            email: 'fake@email.com',
            address: '127.0.0.1',
        };

        res.locals = {
            user: {
                email: 'fake@user.com',
            },
        };

        return new Promise((resolve, reject) => {
            // Вызов метода set
            profile.set(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('updateProfile.error'));
        });
    });
});

describe('Тестирование метода password', () => {
    it('Успешное выполнение метода password', () => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                setPasswordId(_id, pwd) {
                    expect(_id).toBe('fake._id');
                    expect(pwd).toBe(
                        'cf1a63230b18ca6299394958b885096d0fe86c85b3870364706d488e57788e4a'
                    );

                    return new Promise(resolve => {
                        resolve();
                    });
                },
            },
        };

        req.body = {
            password: 'fake.password',
        };

        res.locals = {
            user: {
                _id: 'fake._id',
            },
        };

        return new Promise((resolve, reject) => {
            res.on('send', () => {
                expect(res._getData()).toEqual({ success: true });
                resolve();
            });

            // Вызов метода password
            profile.password(req, res, err => {
                reject(err);
            });
        });
    });

    it('Выполнение метода password с ошибкой валидации', done => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.body = {
            password: '', // invalid password
        };

        // Вызов метода password
        profile.password(req, res, err => {
            expect(err).toEqual(Error('Validate error - password is invalid'));
            done();
        });
    });

    it('Выполнение метода password с ошибкой в вызове setPasswordId', () => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        req.model = {
            user: {
                setPasswordId() {
                    return new Promise((resolve, reject) => {
                        reject(Error('setPasswordId.error'));
                    });
                },
            },
        };

        req.body = {
            password: 'fake.password',
        };

        res.locals = {
            user: {
                _id: 'fake._id',
            },
        };

        return new Promise((resolve, reject) => {
            // Вызов метода password
            profile.password(req, res, err => {
                reject(err);
            });
        }).catch(err => {
            expect(err).toEqual(Error('setPasswordId.error'));
        });
    });
});

