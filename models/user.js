/**
 * Тест модуля моделей данных пользователя
 */

import httpMocks from 'node-mocks-http';

/* eslint max-len: ["error", 130] */
describe('Тестирование метода getUserById', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода getUserById', () => {
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

        return new Promise(resolve => {
            user(req, res, () => {
                resolve(req.model.user.getUserById('fake._id'));
            });
        }).then(result => {
            expect(result).toEqual({ email: 'fake@user.com' });
        });
    });

    it('Успешное выполнение метода getUserById с пустым ответом', () => {
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

        return new Promise(resolve => {
            user(req, res, () => {
                resolve(req.model.user.getUserById('fake._id'));
            });
        }).then(result => {
            expect(result).toBeNull();
        });
    });

    it('Выполнение метода getUserById с ошибкой', () => {
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

        return new Promise((resolve, reject) => {
            user(req, res, () => {
                req.model.user.getUserById('fake._id').catch(err => {
                    reject(err);
                });
            });
        }).catch(err => {
            expect(err).toEqual(Error('getUserById.error'));
        });
    });
});

describe('Тестирование метода getUserBySession', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода getUserBySession', () => {
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

        return new Promise(resolve => {
            user(req, res, () => {
                resolve(req.model.user.getUserBySession('fake.sid'));
            });
        }).then(result => {
            expect(result).toEqual({ email: 'fake@user.com' });
        });
    });

    it('Успешное выполнение метода getUserBySession с пустым ответом', () => {
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

        return new Promise(resolve => {
            user(req, res, () => {
                resolve(req.model.user.getUserBySession('fake.sid'));
            });
        }).then(result => {
            expect(result).toBeNull();
        });
    });

    it('Выполнение метода getUserBySession с ошибкой', () => {
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

        return new Promise((resolve, reject) => {
            user(req, res, () => {
                req.model.user.getUserBySession('fake.sid').catch(err => {
                    reject(err);
                });
            });
        }).catch(err => {
            expect(err).toEqual(Error('getUserBySession.error'));
        });
    });
});

describe('Тестирование метода getUserByEmail', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода getUserByEmail', () => {
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

        return new Promise(resolve => {
            user(req, res, () => {
                resolve(req.model.user.getUserByEmail('fake@email.com'));
            });
        }).then(result => {
            expect(result).toEqual({ email: 'fake@user.com' });
        });
    });

    it('Успешное выполнение метода getUserByEmail с пустым ответом', () => {
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

        return new Promise(resolve => {
            user(req, res, () => {
                resolve(req.model.user.getUserByEmail('fake@email.com'));
            });
        }).then(result => {
            expect(result).toBeNull();
        });
    });

    it('Выполнение метода getUserByEmail с ошибкой', () => {
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

        return new Promise((resolve, reject) => {
            user(req, res, () => {
                req.model.user.getUserByEmail('fake@email.com').catch(err => {
                    reject(err);
                });
            });
        }).catch(err => {
            expect(err).toEqual(Error('getUserByEmail.error'));
        });
    });
});

describe('Тестирование метода create', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода create', () => {
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

        return new Promise(resolve => {
            user(req, res, () => {
                resolve(req.model.user.create({ email: 'fake@user.com' }));
            });
        }).then(result => {
            expect(result).toEqual({ insertedId: 'fake.inserted.id' });
        });
    });

    it('Выполнение метода create c ошибкой', () => {
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

        return new Promise((resolve, reject) => {
            user(req, res, () => {
                req.model.user.create({ email: 'fake@user.com' }).catch(err => {
                    reject(err);
                });
            });
        }).catch(err => {
            expect(err).toEqual(Error('create.error'));
        });
    });
});

describe('Тестирование метода setSessionById', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода setSessionById', () => {
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

        return new Promise(resolve => {
            user(req, res, () => {
                resolve(req.model.user.setSessionById('fake._id', 'fake.sid'));
            });
        });
    });

    it('Выполнение метода setSessionById c ошибкой', () => {
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

        return new Promise((resolve, reject) => {
            user(req, res, () => {
                req.model.user.setSessionById('fake._id', 'fake.sid').catch(err => {
                    reject(err);
                });
            });
        }).catch(err => {
            expect(err).toEqual(Error('setSessionById.error'));
        });
    });
});

describe('Тестирование метода unsetSessionById', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода unsetSessionById', () => {
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

        return new Promise(resolve => {
            user(req, res, () => {
                resolve(req.model.user.unsetSessionById('fake._id'));
            });
        });
    });

    it('Выполнение метода unsetSessionById c ошибкой', () => {
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

        return new Promise((resolve, reject) => {
            user(req, res, () => {
                req.model.user.unsetSessionById('fake._id').catch(err => {
                    reject(err);
                });
            });
        }).catch(err => {
            expect(err).toEqual(Error('unsetSessionById.error'));
        });
    });
});

describe('Тестирование метода setPasswordId', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода setPasswordId', () => {
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

        return new Promise(resolve => {
            user(req, res, () => {
                resolve(req.model.user.setPasswordId('fake._id', 'fake.password'));
            });
        });
    });

    it('Выполнение метода setPasswordId c ошибкой', () => {
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

        return new Promise((resolve, reject) => {
            user(req, res, () => {
                req.model.user.setPasswordId('fake._id', 'fake.password').catch(err => {
                    reject(err);
                });
            });
        }).catch(err => {
            expect(err).toEqual(Error('setPasswordId.error'));
        });
    });
});

describe('Тестирование метода setPasswordByEmail', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода setPasswordByEmail', () => {
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

        return new Promise(resolve => {
            user(req, res, () => {
                resolve(req.model.user.setPasswordByEmail('fake@email.com', 'fake.password'));
            });
        });
    });

    it('Выполнение метода setPasswordByEmail c ошибкой', () => {
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

        return new Promise((resolve, reject) => {
            user(req, res, () => {
                req.model.user.setPasswordByEmail('fake@email.com', 'fake.password').catch(err => {
                    reject(err);
                });
            });
        }).catch(err => {
            expect(err).toEqual(Error('setPasswordByEmail.error'));
        });
    });
});

describe('Тестирование метода update', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода update', () => {
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

        return new Promise(resolve => {
            user(req, res, () => {
                resolve(req.model.user.update('fake._id', { email: 'fake@user.com' }));
            });
        });
    });

    it('Выполнение метода update c ошибкой', () => {
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

        return new Promise((resolve, reject) => {
            user(req, res, () => {
                req.model.user.update('fake._id', { email: 'fake@user.com' }).catch(err => {
                    reject(err);
                });
            });
        }).catch(err => {
            expect(err).toEqual(Error('update.error'));
        });
    });
});
