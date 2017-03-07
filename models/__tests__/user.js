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
            req.model.user.create({}).then(result => {
                expect(result).toEqual({ insertedId: 'insertedId' });
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
                            insertOne() {
                                return new Promise((resolve, reject) => {
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
                expect(result.message).toBe('create - error');
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
                            updateOne() {
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
            req.model.user.setSessionById({}).then(() => {
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
                            updateOne() {
                                return new Promise((resolve, reject) => {
                                    reject(new Error('setSessionById - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setSessionById({}).catch(result => {
                expect(result.message).toBe('setSessionById - error');
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
                            updateOne() {
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
            req.model.user.unsetSessionById({}).then(() => {
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
                            updateOne() {
                                return new Promise((resolve, reject) => {
                                    reject(new Error('unsetSessionById - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.unsetSessionById({}).catch(result => {
                expect(result.message).toBe('unsetSessionById - error');
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
                            updateOne() {
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
            req.model.user.setPasswordId({}).then(() => {
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
                            updateOne() {
                                return new Promise((resolve, reject) => {
                                    reject(new Error('setPasswordId - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setPasswordId({}).catch(result => {
                expect(result.message).toBe('setPasswordId - error');
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
                            updateOne() {
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
            req.model.user.setPasswordByEmail({}).then(() => {
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
                            updateOne() {
                                return new Promise((resolve, reject) => {
                                    reject(new Error('setPasswordByEmail - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.setPasswordByEmail({}).catch(result => {
                expect(result.message).toBe('setPasswordByEmail - error');
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
                            updateOne() {
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
            req.model.user.update({}).then(() => {
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
                            updateOne() {
                                return new Promise((resolve, reject) => {
                                    reject(new Error('update - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.update({}).catch(result => {
                expect(result.message).toBe('update - error');
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
                            updateOne() {
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
            req.model.user.updatePeriod({}).then(() => {
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
                                    reject(new Error('updatePeriod - error'));
                                });
                            },
                        };
                    },
                },
            };
        });

        user(req, res, () => {
            req.model.user.updatePeriod({}).catch(result => {
                expect(result.message).toBe('updatePeriod - error');
                done();
            });
        });
    });
});
