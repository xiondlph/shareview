/**
 * Тест модуля моделей данных системы платежей
 */

import httpMocks from 'node-mocks-http';

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
                            insertOne() {
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
            req.model.payment.add().then(() => {
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
                            insertOne() {
                                return new Promise((resolve, reject) => {
                                    reject(new Error('add - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        payment(req, res, () => {
            req.model.payment.add().catch(result => {
                expect(result.message).toBe('add - error');
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
                            find() {
                                return {
                                    count() {
                                        return new Promise(resolve => {
                                            resolve(0);
                                        });
                                    },
                                    toArray() {
                                        return new Promise(resolve => {
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
            req.model.payment.listById().then(result => {
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
                            find() {
                                return {
                                    count() {
                                        return new Promise((resolve, reject) => {
                                            reject(new Error('listById - count - error'));
                                        });
                                    },
                                    toArray() {
                                        return new Promise(resolve => {
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
            req.model.payment.listById().catch(result => {
                expect(result.message).toBe('listById - count - error');
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
                            find() {
                                return {
                                    count() {
                                        return new Promise(resolve => {
                                            resolve(0);
                                        });
                                    },
                                    toArray() {
                                        return new Promise((resolve, reject) => {
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
            req.model.payment.listById().catch(result => {
                expect(result.message).toBe('listById - toArray - error');
                done();
            });
        });
    });
});
