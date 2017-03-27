/**
 * Тест модуля моделей данных системы платежей
 */

import httpMocks from 'node-mocks-http';

/* eslint max-len: ["error", 130] */
describe('Тестирование метода add', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода add', done => {
        const
            payment = require('../payment').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            insertOne(data) {
                                expect(data).toBe('fake.data');

                                return new Promise(resolve => {
                                    resolve();
                                });
                            },
                        };
                    },
                },
            };
        });

        payment(req, res, () => {
            req.model.payment.add('fake.data').then(() => {
                done();
            });
        });
    });

    it('Выполнение метода add c ошибкой', done => {
        const
            payment = require('../payment').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            insertOne() {
                                return new Promise((resolve, reject) => {
                                    reject(Error('add.error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        payment(req, res, () => {
            req.model.payment.add('fake.data').catch(result => {
                expect(result).toEqual(Error('add.error'));
                done();
            });
        });
    });
});

describe('Тестирование метода listById', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода listById', done => {
        const
            payment = require('../payment').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            find: jest.fn()
                                .mockImplementationOnce((query, data) => {
                                    expect(query).toHaveProperty('label', 'email');
                                    expect(data).toHaveProperty('sort._id', -1);

                                    return {
                                        count() {
                                            return new Promise(resolve => {
                                                resolve(0);
                                            });
                                        },
                                    };
                                })
                                .mockImplementationOnce((query, data) => {
                                    expect(query).toHaveProperty('label', 'email');
                                    expect(data).toHaveProperty('fields.datetime', 1);
                                    expect(data).toHaveProperty('fields.withdraw_amount', 1);
                                    expect(data).toHaveProperty('fields._lastPeriod', 1);
                                    expect(data).toHaveProperty('fields._newPeriod', 1);
                                    expect(data).toHaveProperty('sort._id', -1);
                                    expect(data).toHaveProperty('skip', 0);
                                    expect(data).toHaveProperty('limit', 0);

                                    return {
                                        toArray() {
                                            return new Promise(resolve => {
                                                resolve([]);
                                            });
                                        },
                                    };
                                }),
                        };
                    },
                },
            };
        });

        payment(req, res, () => {
            req.model.payment.listById('email').then(result => {
                expect(result).toEqual({ payments: [], count: 0 });
                done();
            });
        });
    });

    it('Выполнение метода listById с ошибкой в count', done => {
        const
            payment = require('../payment').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            find: jest.fn()
                                .mockImplementationOnce(() => {
                                    return {
                                        count() {
                                            return new Promise((resolve, reject) => {
                                                reject(Error('listById.count - error'));
                                            });
                                        },
                                    };
                                }),
                        };
                    },
                },
            };
        });

        payment(req, res, () => {
            req.model.payment.listById('email').catch(result => {
                expect(result).toEqual(Error('listById.count - error'));
                done();
            });
        });
    });

    it('Выполнение метода listById с ошибкой в toArray', done => {
        const
            payment = require('../payment').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('../../db', () => {
            return {
                db: {
                    collection() {
                        return {
                            find: jest.fn()
                                .mockImplementationOnce(() => {
                                    return {
                                        count() {
                                            return new Promise(resolve => {
                                                resolve(0);
                                            });
                                        },
                                    };
                                })
                                .mockImplementationOnce(() => {
                                    return {
                                        toArray() {
                                            return new Promise((resolve, reject) => {
                                                reject(Error('listById.toArray - error'));
                                            });
                                        },
                                    };
                                }),
                        };
                    },
                },
            };
        });

        payment(req, res, () => {
            req.model.payment.listById('email').catch(result => {
                expect(result).toEqual(Error('listById.toArray - error'));
                done();
            });
        });
    });
});
