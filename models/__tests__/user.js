/**
 * Тест модуля моделей данных пользователя
 */

import httpMocks from 'node-mocks-http';

/* eslint max-len: ["error", 120] */
describe('Тестирование метода getUserById', () => {
    it('Успешное выполнение метода getUserById', (done) => {
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
                                if (query._id !== '_id') {
                                    throw new Error('getUserById - find - error invalid query');
                                }

                                return {
                                    limit(count) {
                                        if (count !== 1) {
                                            throw new Error('getUserById - limit - error invalid count');
                                        }

                                        return {
                                            toArray() {
                                                return new Promise(resolve => {
                                                    resolve([{
                                                        name: 'user',
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
            req.model.user.getUserById('_id').then(result => {
                expect(result).toEqual({ name: 'user' });
                done();
            });
        });
    });

    it('Успешное выполнение метода getUserById с пустым ответом', (done) => {
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
                                if (query._id !== '_id') {
                                    throw new Error('getUserById - find - error invalid query');
                                }

                                return {
                                    limit(count) {
                                        if (count !== 1) {
                                            throw new Error('getUserById - limit - error invalid count');
                                        }

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
            req.model.user.getUserById('_id').then(result => {
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
                            find(query) {
                                if (query._id !== '_id') {
                                    throw new Error('getUserById - find - error invalid query');
                                }

                                return {
                                    limit(count) {
                                        if (count !== 1) {
                                            throw new Error('getUserById - limit - error invalid count');
                                        }

                                        return {
                                            toArray() {
                                                return new Promise((resolve, reject) => {
                                                    reject(new Error('getUserById - error'));
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
            req.model.user.getUserById('_id').catch(result => {
                expect(result.message).toEqual('getUserById - error');
                done();
            });
        });
    });
});

describe('Тестирование метода getUserBySession', () => {
    it('Успешное выполнение метода getUserBySession', (done) => {
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
                                if (query.sid !== 'sid') {
                                    throw new Error('getUserBySession - find - error invalid query');
                                }

                                return {
                                    limit(count) {
                                        if (count !== 1) {
                                            throw new Error('getUserBySession - limit - error invalid count');
                                        }

                                        return {
                                            toArray() {
                                                return new Promise(resolve => {
                                                    resolve([{
                                                        name: 'user',
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
            req.model.user.getUserBySession('sid').then(result => {
                expect(result).toEqual({ name: 'user' });
                done();
            });
        });
    });

    it('Успешное выполнение метода getUserBySession с пустым ответом', (done) => {
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
                                if (query.sid !== 'sid') {
                                    throw new Error('getUserBySession - find - error invalid query');
                                }

                                return {
                                    limit(count) {
                                        if (count !== 1) {
                                            throw new Error('getUserBySession - limit - error invalid count');
                                        }

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
            req.model.user.getUserBySession('sid').then(result => {
                expect(result).toEqual(null);
                done();
            });
        });
    });

    it('Выполнение метода getUserBySession с ошибкой', (done) => {
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
                                if (query.sid !== 'sid') {
                                    throw new Error('getUserBySession - find - error invalid query');
                                }

                                return {
                                    limit(count) {
                                        if (count !== 1) {
                                            throw new Error('getUserBySession - limit - error invalid count');
                                        }

                                        return {
                                            toArray() {
                                                return new Promise((resolve, reject) => {
                                                    reject(new Error('getUserBySession - error'));
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
            req.model.user.getUserBySession('sid').catch(result => {
                expect(result.message).toEqual('getUserBySession - error');
                done();
            });
        });
    });
});

describe('Тестирование метода getUserByEmail', () => {
    it('Успешное выполнение метода getUserByEmail', (done) => {
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
                                if (query.email !== 'email') {
                                    throw new Error('getUserByEmail - find - error invalid query');
                                }

                                return {
                                    limit(count) {
                                        if (count !== 1) {
                                            throw new Error('getUserByEmail - limit - error invalid count');
                                        }

                                        return {
                                            toArray() {
                                                return new Promise(resolve => {
                                                    resolve([{
                                                        name: 'user',
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
            req.model.user.getUserByEmail('email').then(result => {
                expect(result).toEqual({ name: 'user' });
                done();
            });
        });
    });

    it('Успешное выполнение метода getUserByEmail с пустым ответом', (done) => {
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
                                if (query.email !== 'email') {
                                    throw new Error('getUserByEmail - find - error invalid query');
                                }

                                return {
                                    limit(count) {
                                        if (count !== 1) {
                                            throw new Error('getUserByEmail - limit - error invalid count');
                                        }

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
            req.model.user.getUserByEmail('email').then(result => {
                expect(result).toEqual(null);
                done();
            });
        });
    });

    it('Выполнение метода getUserByEmail с ошибкой', (done) => {
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
                                if (query.email !== 'email') {
                                    throw new Error('getUserByEmail - find - error invalid query');
                                }

                                return {
                                    limit(count) {
                                        if (count !== 1) {
                                            throw new Error('getUserByEmail - limit - error invalid count');
                                        }

                                        return {
                                            toArray() {
                                                return new Promise((resolve, reject) => {
                                                    reject(new Error('getUserByEmail - error'));
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
            req.model.user.getUserByEmail('email').catch(result => {
                expect(result.message).toEqual('getUserByEmail - error');
                done();
            });
        });
    });
});

describe('Тестирование метода create', () => {
    it('Успешное выполнение метода create', (done) => {
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
                                return new Promise((resolve, reject) => {
                                    if (typeof data !== 'object') {
                                        reject(new Error('create - insertOne - error invalid options'));
                                        return;
                                    }

                                    resolve({
                                        insertedId: 'insertedId',
                                    });
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.create({}).then(result => {
                expect(result).toEqual({ insertedId: 'insertedId' });
                done();
            }).catch((err) => {
                expect(err).toEqual(null);
                done();
            });
        });
    });

    it('Выполнение метода create c ошибкой', (done) => {
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
                                return new Promise((resolve, reject) => {
                                    if (typeof data !== 'object') {
                                        reject(new Error('create - insertOne - error invalid options'));
                                        return;
                                    }

                                    reject(new Error('create - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.create({}).catch(result => {
                expect(result.message).toEqual('create - error');
                done();
            });
        });
    });
});

describe('Тестирование метода setSessionById', () => {
    it('Успешное выполнение метода setSessionById', (done) => {
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
                                return new Promise((resolve, reject) => {
                                    if (
                                        query._id !== '_id' ||
                                        !data.$set ||
                                        data.$set.sid !== 'sid'
                                    ) {
                                        reject(new Error('setSessionById - updateOne - error invalid options'));
                                        return;
                                    }

                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setSessionById('_id', 'sid').then(() => {
                done();
            }).catch((err) => {
                expect(err).toEqual(null);
                done();
            });
        });
    });

    it('Выполнение метода setSessionById c ошибкой', (done) => {
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
                                return new Promise((resolve, reject) => {
                                    if (
                                        query._id !== '_id' ||
                                        !data.$set ||
                                        data.$set.sid !== 'sid'
                                    ) {
                                        reject(new Error('setSessionById - updateOne - error invalid options'));
                                        return;
                                    }

                                    reject(new Error('setSessionById - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setSessionById('_id', 'sid').catch(result => {
                expect(result.message).toEqual('setSessionById - error');
                done();
            });
        });
    });
});

describe('Тестирование метода unsetSessionById', () => {
    it('Успешное выполнение метода unsetSessionById', (done) => {
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
                                return new Promise((resolve, reject) => {
                                    if (
                                        query._id !== '_id' ||
                                        !data.$unset ||
                                        data.$unset.sid !== true
                                    ) {
                                        reject(new Error('unsetSessionById - updateOne - error invalid options'));
                                        return;
                                    }

                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.unsetSessionById('_id').then(() => {
                done();
            }).catch((err) => {
                expect(err).toEqual(null);
                done();
            });
        });
    });

    it('Выполнение метода unsetSessionById c ошибкой', (done) => {
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
                                return new Promise((resolve, reject) => {
                                    if (
                                        query._id !== '_id' ||
                                        !data.$unset ||
                                        data.$unset.sid !== true
                                    ) {
                                        reject(new Error('unsetSessionById - updateOne - error invalid options'));
                                        return;
                                    }

                                    reject(new Error('unsetSessionById - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.unsetSessionById('_id').catch(result => {
                expect(result.message).toEqual('unsetSessionById - error');
                done();
            });
        });
    });
});

describe('Тестирование метода setPasswordId', () => {
    it('Успешное выполнение метода setPasswordId', (done) => {
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
                                return new Promise((resolve, reject) => {
                                    if (
                                        query._id !== '_id' ||
                                        !data.$set ||
                                        data.$set.password !== 'password'
                                    ) {
                                        reject(new Error('setPasswordId - updateOne - error invalid options'));
                                        return;
                                    }

                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setPasswordId('_id', 'password').then(() => {
                done();
            }).catch((err) => {
                expect(err).toEqual(null);
                done();
            });
        });
    });

    it('Выполнение метода setPasswordId c ошибкой', (done) => {
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
                                return new Promise((resolve, reject) => {
                                    if (
                                        query._id !== '_id' ||
                                        !data.$set ||
                                        data.$set.password !== 'password'
                                    ) {
                                        reject(new Error('setPasswordId - updateOne - error invalid options'));
                                        return;
                                    }

                                    reject(new Error('setPasswordId - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setPasswordId('_id', 'password').catch(result => {
                expect(result.message).toEqual('setPasswordId - error');
                done();
            });
        });
    });
});

describe('Тестирование метода setPasswordByEmail', () => {
    it('Успешное выполнение метода setPasswordByEmail', (done) => {
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
                                return new Promise((resolve, reject) => {
                                    if (
                                        query.email !== 'email' ||
                                        !data.$set ||
                                        data.$set.password !== 'password'
                                    ) {
                                        reject(new Error('setPasswordByEmail - updateOne - error invalid options'));
                                        return;
                                    }

                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setPasswordByEmail('email', 'password').then(() => {
                done();
            }).catch((err) => {
                expect(err).toEqual(null);
                done();
            });
        });
    });

    it('Выполнение метода setPasswordByEmail c ошибкой', (done) => {
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
                                return new Promise((resolve, reject) => {
                                    if (
                                        query.email !== 'email' ||
                                        !data.$set ||
                                        data.$set.password !== 'password'
                                    ) {
                                        reject(new Error('setPasswordByEmail - updateOne - error invalid options'));
                                        return;
                                    }

                                    reject(new Error('setPasswordByEmail - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setPasswordByEmail('email', 'password').catch(result => {
                expect(result.message).toEqual('setPasswordByEmail - error');
                done();
            });
        });
    });
});

describe('Тестирование метода update', () => {
    it('Успешное выполнение метода update', (done) => {
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
                                return new Promise((resolve, reject) => {
                                    if (
                                        query._id !== '_id' ||
                                        data.$set !== 'data'
                                    ) {
                                        reject(new Error('update - updateOne - error invalid options'));
                                        return;
                                    }

                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.update('_id', 'data').then(() => {
                done();
            }).catch((err) => {
                expect(err).toEqual(null);
                done();
            });
        });
    });

    it('Выполнение метода update c ошибкой', (done) => {
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
                                return new Promise((resolve, reject) => {
                                    if (
                                        query._id !== '_id' ||
                                        data.$set !== 'data'
                                    ) {
                                        reject(new Error('update - updateOne - error invalid options'));
                                        return;
                                    }

                                    reject(new Error('update - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.update('_id', 'data').catch(result => {
                expect(result.message).toEqual('update - error');
                done();
            });
        });
    });
});

describe('Тестирование метода updatePeriod', () => {
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
                                return new Promise((resolve, reject) => {
                                    if (
                                        query._id !== '_id' ||
                                        !data.$set ||
                                        data.$set.period !== 'period'
                                    ) {
                                        reject(new Error('updatePeriod - updateOne - error invalid options'));
                                        return;
                                    }

                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.updatePeriod('_id', 'period').then(() => {
                done();
            }).catch((err) => {
                expect(err).toEqual(null);
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
                            updateOne(query, data) {
                                return new Promise((resolve, reject) => {
                                    if (
                                        query._id !== '_id' ||
                                        !data.$set ||
                                        data.$set.period !== 'period'
                                    ) {
                                        reject(new Error('updatePeriod - updateOne - error invalid options'));
                                        return;
                                    }

                                    reject(new Error('updatePeriod - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.updatePeriod('_id', 'period').catch(result => {
                expect(result.message).toEqual('updatePeriod - error');
                done();
            });
        });
    });
});
