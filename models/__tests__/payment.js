/**
 * Тест модуля моделей данных системы платежей
 */

import httpMocks from 'node-mocks-http';

/* eslint max-len: ["error", 120] */
describe('Тестирование метода add', () => {
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
                                return new Promise((resolve, reject) => {
                                    if (data !== 'data') {
                                        reject(new Error('add - insertOne - error invalid options'));
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

        payment(req, res, () => {
            req.model.payment.add('data').then(() => {
                done();
            }).catch((err) => {
                expect(err).toEqual(null);
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
                                return new Promise((resolve, reject) => {
                                    if (data !== 'data') {
                                        reject(new Error('add - insertOne - error invalid options'));
                                        return;
                                    }

                                    reject(new Error('add - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        payment(req, res, () => {
            req.model.payment.add('data').catch(result => {
                expect(result.message).toEqual('add - error');
                done();
            });
        });
    });
});

describe('Тестирование метода listById', () => {
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
                            find(query, data) {
                                return {
                                    count() {
                                        return new Promise((resolve, reject) => {
                                            if (
                                                query.label !== 'email' ||
                                                !data.sort ||
                                                data.sort._id !== -1
                                            ) {
                                                reject(new Error('listById - find - error invalid options'));
                                                return;
                                            }

                                            resolve(0);
                                        });
                                    },
                                    toArray() {
                                        return new Promise((resolve, reject) => {
                                            if (
                                                query.label !== 'email' ||
                                                !data.fields ||
                                                data.fields.datetime !== 1 ||
                                                data.fields.withdraw_amount !== 1 ||
                                                data.fields._lastPeriod !== 1 ||
                                                data.fields._newPeriod !== 1 ||
                                                !data.sort ||
                                                data.sort._id !== -1 ||
                                                data.skip !== 0 ||
                                                data.limit !== 0
                                            ) {
                                                reject(new Error('listById - find - error invalid options'));
                                                return;
                                            }

                                            resolve([]);
                                        });
                                    },
                                };
                            },
                        };
                    },
                },
            };
        });

        payment(req, res, () => {
            req.model.payment.listById('email').then(result => {
                expect(result).toEqual({ payments: [], count: 0 });
                done();
            }).catch((err) => {
                expect(err).toEqual(null);
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
                            find(query, data) {
                                return {
                                    count() {
                                        return new Promise((resolve, reject) => {
                                            if (
                                                query.label !== 'email' ||
                                                !data.sort ||
                                                data.sort._id !== -1
                                            ) {
                                                reject(new Error('listById - find - error invalid options'));
                                                return;
                                            }

                                            reject(new Error('listById - count - error'));
                                        });
                                    },
                                    toArray() {
                                        return new Promise((resolve, reject) => {
                                            if (
                                                query.label !== 'email' ||
                                                !data.fields ||
                                                data.fields.datetime !== 1 ||
                                                data.fields.withdraw_amount !== 1 ||
                                                data.fields._lastPeriod !== 1 ||
                                                data.fields._newPeriod !== 1 ||
                                                !data.sort ||
                                                data.sort._id !== -1 ||
                                                data.skip !== 0 ||
                                                data.limit !== 0
                                            ) {
                                                reject(new Error('listById - find - error invalid options'));
                                                return;
                                            }

                                            resolve([]);
                                        });
                                    },
                                };
                            },
                        };
                    },
                },
            };
        });

        payment(req, res, () => {
            req.model.payment.listById('email').catch(result => {
                expect(result.message).toEqual('listById - count - error');
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
                            find(query, data) {
                                return {
                                    count() {
                                        return new Promise((resolve, reject) => {
                                            if (
                                                query.label !== 'email' ||
                                                !data.sort ||
                                                data.sort._id !== -1
                                            ) {
                                                reject(new Error('listById - find - error invalid options'));
                                                return;
                                            }

                                            resolve(0);
                                        });
                                    },
                                    toArray() {
                                        return new Promise((resolve, reject) => {
                                            if (
                                                query.label !== 'email' ||
                                                !data.fields ||
                                                data.fields.datetime !== 1 ||
                                                data.fields.withdraw_amount !== 1 ||
                                                data.fields._lastPeriod !== 1 ||
                                                data.fields._newPeriod !== 1 ||
                                                !data.sort ||
                                                data.sort._id !== -1 ||
                                                data.skip !== 0 ||
                                                data.limit !== 0
                                            ) {
                                                reject(new Error('listById - find - error invalid options'));
                                                return;
                                            }

                                            reject(new Error('listById - toArray - error'));
                                        });
                                    },
                                };
                            },
                        };
                    },
                },
            };
        });

        payment(req, res, () => {
            req.model.payment.listById('email').catch(result => {
                expect(result.message).toEqual('listById - toArray - error');
                done();
            });
        });
    });
});
