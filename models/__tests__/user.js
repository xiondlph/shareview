/**
 * Тест модуля моделей данных пользователя
 */

import httpMocks from 'node-mocks-http';

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
                            find() {
                                return {
                                    limit() {
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
            expect(req.model.user.getUserById()).toBeDefined();
            req.model.user.getUserById().then(result => {
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
            req.model.user.getUserById().then(result => {
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
            req.model.user.getUserById().catch(result => {
                expect(result.message).toBe('getUserById - error');
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
                            find() {
                                return {
                                    limit() {
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
            expect(req.model.user.getUserBySession()).toBeDefined();
            req.model.user.getUserBySession().then(result => {
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
            req.model.user.getUserBySession().then(result => {
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
                            find() {
                                return {
                                    limit() {
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
            req.model.user.getUserBySession().catch(result => {
                expect(result.message).toBe('getUserBySession - error');
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
                            find() {
                                return {
                                    limit() {
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
            expect(req.model.user.getUserByEmail()).toBeDefined();
            req.model.user.getUserByEmail().then(result => {
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
            req.model.user.getUserByEmail().then(result => {
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
                            find() {
                                return {
                                    limit() {
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
            req.model.user.getUserByEmail().catch(result => {
                expect(result.message).toBe('getUserByEmail - error');
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
                            insertOne() {
                                return new Promise(resolve => {
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
            expect(req.model.user.create({})).toBeDefined();
            req.model.user.create({}).then(result => {
                expect(result).toEqual({ insertedId: 'insertedId' });
                done();
            });
        });
    });
});
