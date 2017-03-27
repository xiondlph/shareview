/**
 * Тест модуля моделей данных пользователя
 */

import httpMocks from 'node-mocks-http';

/* eslint max-len: ["error", 130] */
describe('Тестирование метода getUserById', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода getUserById', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            find(query) {
                                expect(query).toHaveProperty('_id', 'fake._id');

                                return {
                                    limit(count) {
                                        expect(count).toBe(1);

                                        return {
                                            toArray() {
                                                return new Promise(resolve => {
                                                    resolve([{
                                                        email: 'fake@user.com',
                                                    }]);
                                                });
                                            },
                                        };
                                    },
                                };
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.getUserById('fake._id').then(result => {
                expect(result).toEqual({ email: 'fake@user.com' });
                done();
            });
        });
    });

    it('Успешное выполнение метода getUserById с пустым ответом', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            find() {
                                return {
                                    limit() {
                                        return {
                                            toArray() {
                                                return new Promise(resolve => {
                                                    resolve([]);
                                                });
                                            },
                                        };
                                    },
                                };
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.getUserById('fake._id').then(result => {
                expect(result).toEqual(null);
                done();
            });
        });
    });

    it('Выполнение метода getUserById с ошибкой', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            find() {
                                return {
                                    limit() {
                                        return {
                                            toArray() {
                                                return new Promise((resolve, reject) => {
                                                    reject(Error('getUserById.error'));
                                                });
                                            },
                                        };
                                    },
                                };
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.getUserById('fake._id').catch(result => {
                expect(result).toEqual(Error('getUserById.error'));
                done();
            });
        });
    });
});

describe('Тестирование метода getUserBySession', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода getUserBySession', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            find(query) {
                                expect(query).toHaveProperty('sid', 'fake.sid');

                                return {
                                    limit(count) {
                                        expect(count).toBe(1);

                                        return {
                                            toArray() {
                                                return new Promise(resolve => {
                                                    resolve([{
                                                        email: 'fake@user.com',
                                                    }]);
                                                });
                                            },
                                        };
                                    },
                                };
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.getUserBySession('fake.sid').then(result => {
                expect(result).toEqual({ email: 'fake@user.com' });
                done();
            });
        });
    });

    it('Успешное выполнение метода getUserBySession с пустым ответом', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            find() {
                                return {
                                    limit() {
                                        return {
                                            toArray() {
                                                return new Promise(resolve => {
                                                    resolve([]);
                                                });
                                            },
                                        };
                                    },
                                };
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.getUserBySession('fake.sid').then(result => {
                expect(result).toEqual(null);
                done();
            });
        });
    });

    it('Выполнение метода getUserBySession с ошибкой', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            find() {
                                return {
                                    limit() {
                                        return {
                                            toArray() {
                                                return new Promise((resolve, reject) => {
                                                    reject(Error('getUserBySession.error'));
                                                });
                                            },
                                        };
                                    },
                                };
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.getUserBySession('fake.sid').catch(result => {
                expect(result).toEqual(Error('getUserBySession.error'));
                done();
            });
        });
    });
});

describe('Тестирование метода getUserByEmail', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода getUserByEmail', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            find(query) {
                                expect(query).toHaveProperty('email', 'fake@email.com');

                                return {
                                    limit(count) {
                                        expect(count).toBe(1);

                                        return {
                                            toArray() {
                                                return new Promise(resolve => {
                                                    resolve([{
                                                        email: 'fake@user.com',
                                                    }]);
                                                });
                                            },
                                        };
                                    },
                                };
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.getUserByEmail('fake@email.com').then(result => {
                expect(result).toEqual({ email: 'fake@user.com' });
                done();
            });
        });
    });

    it('Успешное выполнение метода getUserByEmail с пустым ответом', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            find() {
                                return {
                                    limit() {
                                        return {
                                            toArray() {
                                                return new Promise(resolve => {
                                                    resolve([]);
                                                });
                                            },
                                        };
                                    },
                                };
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.getUserByEmail('fake@email.com').then(result => {
                expect(result).toEqual(null);
                done();
            });
        });
    });

    it('Выполнение метода getUserByEmail с ошибкой', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            find() {
                                return {
                                    limit() {
                                        return {
                                            toArray() {
                                                return new Promise((resolve, reject) => {
                                                    reject(Error('getUserByEmail.error'));
                                                });
                                            },
                                        };
                                    },
                                };
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.getUserByEmail('fake@email.com').catch(result => {
                expect(result).toEqual(Error('getUserByEmail.error'));
                done();
            });
        });
    });
});

describe('Тестирование метода create', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода create', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            insertOne(data) {
                                expect(data).toEqual({
                                    email: 'fake@user.com',
                                });

                                return new Promise(resolve => {
                                    resolve({
                                        insertedId: 'fake.inserted.id',
                                    });
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.create({ email: 'fake@user.com' }).then(result => {
                expect(result).toEqual({ insertedId: 'fake.inserted.id' });
                done();
            });
        });
    });

    it('Выполнение метода create c ошибкой', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            insertOne() {
                                return new Promise((resolve, reject) => {
                                    reject(Error('create.error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.create({ email: 'fake@user.com' }).catch(result => {
                expect(result).toEqual(Error('create.error'));
                done();
            });
        });
    });
});

describe('Тестирование метода setSessionById', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода setSessionById', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            updateOne(query, data) {
                                expect(query).toHaveProperty('_id', 'fake._id');
                                expect(data).toHaveProperty('$set.sid', 'fake.sid');

                                return new Promise(resolve => {
                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setSessionById('fake._id', 'fake.sid').then(() => {
                done();
            });
        });
    });

    it('Выполнение метода setSessionById c ошибкой', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            updateOne() {
                                return new Promise((resolve, reject) => {
                                    reject(Error('setSessionById.error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setSessionById('fake._id', 'fake.sid').catch(result => {
                expect(result).toEqual(Error('setSessionById.error'));
                done();
            });
        });
    });
});

describe('Тестирование метода unsetSessionById', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода unsetSessionById', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            updateOne(query, data) {
                                expect(query).toHaveProperty('_id', 'fake._id');
                                expect(data).toHaveProperty('$unset.sid', true);

                                return new Promise(resolve => {
                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.unsetSessionById('fake._id').then(() => {
                done();
            });
        });
    });

    it('Выполнение метода unsetSessionById c ошибкой', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            updateOne() {
                                return new Promise((resolve, reject) => {
                                    reject(Error('unsetSessionById.error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.unsetSessionById('fake._id').catch(result => {
                expect(result).toEqual(Error('unsetSessionById.error'));
                done();
            });
        });
    });
});

describe('Тестирование метода setPasswordId', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода setPasswordId', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            updateOne(query, data) {
                                expect(query).toHaveProperty('_id', 'fake._id');
                                expect(data).toHaveProperty('$set.password', 'fake.password');

                                return new Promise(resolve => {
                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setPasswordId('fake._id', 'fake.password').then(() => {
                done();
            });
        });
    });

    it('Выполнение метода setPasswordId c ошибкой', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            updateOne() {
                                return new Promise((resolve, reject) => {
                                    reject(Error('setPasswordId.error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setPasswordId('fake._id', 'fake.password').catch(result => {
                expect(result).toEqual(Error('setPasswordId.error'));
                done();
            });
        });
    });
});

describe('Тестирование метода setPasswordByEmail', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода setPasswordByEmail', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            updateOne(query, data) {
                                expect(query).toHaveProperty('email', 'fake@email.com');
                                expect(data).toHaveProperty('$set.password', 'fake.password');

                                return new Promise(resolve => {
                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setPasswordByEmail('fake@email.com', 'fake.password').then(() => {
                done();
            });
        });
    });

    it('Выполнение метода setPasswordByEmail c ошибкой', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            updateOne() {
                                return new Promise((resolve, reject) => {
                                    reject(Error('setPasswordByEmail.error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setPasswordByEmail('fake@email.com', 'fake.password').catch(result => {
                expect(result).toEqual(Error('setPasswordByEmail.error'));
                done();
            });
        });
    });
});

describe('Тестирование метода update', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода update', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            updateOne(query, data) {
                                expect(query).toHaveProperty('_id', 'fake._id');
                                expect(data).toHaveProperty('$set.email', 'fake@user.com');

                                return new Promise(resolve => {
                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.update('fake._id', { email: 'fake@user.com' }).then(() => {
                done();
            });
        });
    });

    it('Выполнение метода update c ошибкой', done => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            updateOne() {
                                return new Promise((resolve, reject) => {
                                    reject(Error('update.error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.update('fake._id', { email: 'fake@user.com' }).catch(result => {
                expect(result).toEqual(Error('update.error'));
                done();
            });
        });
    });
});

describe('Тестирование метода updatePeriod', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода updatePeriod', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            updateOne(query, data) {
                                expect(query).toHaveProperty('_id', 'fake._id');
                                expect(data).toHaveProperty('$set.period', 'fake.period');

                                return new Promise(resolve => {
                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.updatePeriod('fake._id', 'fake.period').then(() => {
                done();
            });
        });
    });

    it('Выполнение метода updatePeriod c ошибкой', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            updateOne() {
                                return new Promise((resolve, reject) => {
                                    reject(Error('updatePeriod.error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.updatePeriod('fake._id', 'fake.period').catch(result => {
                expect(result).toEqual(Error('updatePeriod.error'));
                done();
            });
        });
    });
});
