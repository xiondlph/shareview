/**
 * Тест модуля моделей данных системы платежей
 */

import httpMocks from 'node-mocks-http';

/* eslint max-len: ["error", 130] */
describe('Тестирование метода add', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода add', (done) => {
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
                                if (data !== 'data') {
                                    throw new Error('add.insertOne.error - invalid data argument');
                                }

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
            req.model.payment.add('data').then(() => {
                done();
            });
        });
    });

    it('Выполнение метода add c ошибкой', (done) => {
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
                                if (data !== 'data') {
                                    throw new Error('add.insertOne.error - invalid data argument');
                                }

                                return new Promise((resolve, reject) => {
                                    reject(new Error('add.error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        payment(req, res, () => {
            req.model.payment.add('data').catch(result => {
                expect(result.message).toEqual('add.error');
                done();
            });
        });
    });
});

describe('Тестирование метода listById', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода listById', (done) => {
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
                                    if (query.label !== 'email') {
                                        throw new Error('listById.find.error - invalid query property "label"');
                                    }

                                    if (!data.sort) {
                                        throw new Error('listById.find.error - invalid data property "sort"');
                                    }

                                    if (data.sort._id !== -1) {
                                        throw new Error('listById.find.error - invalid data property "sort._id"');
                                    }

                                    return {
                                        count() {
                                            return new Promise(resolve => {
                                                resolve(0);
                                            });
                                        },
                                    };
                                })
                                .mockImplementationOnce((query, data) => {
                                    if (query.label !== 'email') {
                                        throw new Error('listById.find.error - invalid query property "label"');
                                    }

                                    if (!data.fields) {
                                        throw new Error('listById.find.error - invalid data property "fields"');
                                    }

                                    if (data.fields.datetime !== 1) {
                                        throw new Error('listById.find.error - invalid data property "fields.datetime"');
                                    }

                                    if (data.fields.withdraw_amount !== 1) {
                                        throw new Error('listById.find.error - invalid data property "fields.withdraw_amount"');
                                    }

                                    if (data.fields._lastPeriod !== 1) {
                                        throw new Error('listById.find.error - invalid data property "fields._lastPeriod"');
                                    }

                                    if (data.fields._newPeriod !== 1) {
                                        throw new Error('listById.find.error - invalid data property "fields._newPeriod"');
                                    }

                                    if (!data.sort) {
                                        throw new Error('listById.find.error - invalid data property "sort"');
                                    }

                                    if (data.sort._id !== -1) {
                                        throw new Error('listById.find.error - invalid data property "sort._id"');
                                    }

                                    if (data.skip !== 0) {
                                        throw new Error('listById.find.error - invalid data property "skip"');
                                    }

                                    if (data.limit !== 0) {
                                        throw new Error('listById.find.error - invalid data property "limit"');
                                    }

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

    it('Выполнение метода listById с ошибкой в count', (done) => {
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
                                    if (query.label !== 'email') {
                                        throw new Error('listById.find.error - invalid query property "label"');
                                    }

                                    if (!data.sort) {
                                        throw new Error('listById.find.error - invalid data property "sort"');
                                    }

                                    if (data.sort._id !== -1) {
                                        throw new Error('listById.find.error - invalid data property "sort._id"');
                                    }

                                    return {
                                        count() {
                                            return new Promise((resolve, reject) => {
                                                reject(new Error('listById.count - error'));
                                            });
                                        },
                                    };
                                })
                                .mockImplementationOnce((query, data) => {
                                    if (query.label !== 'email') {
                                        throw new Error('listById.find.error - invalid query property "label"');
                                    }

                                    if (!data.fields) {
                                        throw new Error('listById.find.error - invalid data property "fields"');
                                    }

                                    if (data.fields.datetime !== 1) {
                                        throw new Error('listById.find.error - invalid data property "fields.datetime"');
                                    }

                                    if (data.fields.withdraw_amount !== 1) {
                                        throw new Error('listById.find.error - invalid data property "fields.withdraw_amount"');
                                    }

                                    if (data.fields._lastPeriod !== 1) {
                                        throw new Error('listById.find.error - invalid data property "fields._lastPeriod"');
                                    }

                                    if (data.fields._newPeriod !== 1) {
                                        throw new Error('listById.find.error - invalid data property "fields._newPeriod"');
                                    }

                                    if (!data.sort) {
                                        throw new Error('listById.find.error - invalid data property "sort"');
                                    }

                                    if (data.sort._id !== -1) {
                                        throw new Error('listById.find.error - invalid data property "sort._id"');
                                    }

                                    if (data.skip !== 0) {
                                        throw new Error('listById.find.error - invalid data property "skip"');
                                    }

                                    if (data.limit !== 0) {
                                        throw new Error('listById.find.error - invalid data property "limit"');
                                    }

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
            req.model.payment.listById('email').catch(result => {
                expect(result.message).toEqual('listById.count - error');
                done();
            });
        });
    });

    it('Выполнение метода listById с ошибкой в toArray', (done) => {
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
                                    if (query.label !== 'email') {
                                        throw new Error('listById.find.error - invalid query property "label"');
                                    }

                                    if (!data.sort) {
                                        throw new Error('listById.find.error - invalid data property "sort"');
                                    }

                                    if (data.sort._id !== -1) {
                                        throw new Error('listById.find.error - invalid data property "sort._id"');
                                    }

                                    return {
                                        count() {
                                            return new Promise(resolve => {
                                                resolve(0);
                                            });
                                        },
                                    };
                                })
                                .mockImplementationOnce((query, data) => {
                                    if (query.label !== 'email') {
                                        throw new Error('listById.find.error - invalid query property "label"');
                                    }

                                    if (!data.fields) {
                                        throw new Error('listById.find.error - invalid data property "fields"');
                                    }

                                    if (data.fields.datetime !== 1) {
                                        throw new Error('listById.find.error - invalid data property "fields.datetime"');
                                    }

                                    if (data.fields.withdraw_amount !== 1) {
                                        throw new Error('listById.find.error - invalid data property "fields.withdraw_amount"');
                                    }

                                    if (data.fields._lastPeriod !== 1) {
                                        throw new Error('listById.find.error - invalid data property "fields._lastPeriod"');
                                    }

                                    if (data.fields._newPeriod !== 1) {
                                        throw new Error('listById.find.error - invalid data property "fields._newPeriod"');
                                    }

                                    if (!data.sort) {
                                        throw new Error('listById.find.error - invalid data property "sort"');
                                    }

                                    if (data.sort._id !== -1) {
                                        throw new Error('listById.find.error - invalid data property "sort._id"');
                                    }

                                    if (data.skip !== 0) {
                                        throw new Error('listById.find.error - invalid data property "skip"');
                                    }

                                    if (data.limit !== 0) {
                                        throw new Error('listById.find.error - invalid data property "limit"');
                                    }

                                    return {
                                        toArray() {
                                            return new Promise((resolve, reject) => {
                                                reject(new Error('listById.toArray - error'));
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
                expect(result.message).toEqual('listById.toArray - error');
                done();
            });
        });
    });
});
