/**
 * Интеграционный тест для API метода /api/password
 */

jest.mock('../exception');

/* eslint max-len: ["error", 120] */
describe('Смена пароля (/api/password) - ', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешная смена пароля', done => {
        const
            supertest = require('supertest'),
            http = require('../server').default,
            request = http.then(server => {
                return supertest.agent(server);
            });

        jest.mock('../db', () => {
            return {
                init: new Promise((resolve) => {
                    resolve();
                }),

                db: {
                    collection: jest.fn()
                        // Mock для req.model.user.getUserById
                        .mockImplementationOnce(() => {
                            return {
                                find() {
                                    return {
                                        limit() {
                                            return {
                                                toArray() {
                                                    return new Promise(resolve => {
                                                        resolve([{
                                                            _id: 'fake._id',
                                                            email: 'fake@email.com',
                                                            address: 'fake.address',
                                                            salt: 'fake.salt',
                                                        }]);
                                                    });
                                                },
                                            };
                                        },
                                    };
                                },
                            };
                        })

                        // Mock для req.model.user.setPasswordId
                        .mockImplementationOnce(() => {
                            return {
                                updateOne() {
                                    return new Promise(resolve => {
                                        resolve();
                                    });
                                },
                            };
                        }),
                },
            };
        });

        request.then(agent => {
            agent
                .post('/api/password')
                .send({
                    password: 'fake.password',
                })
                .set('x-access-token', 'fake.token.success')
                .expect(200)
                .end((err, res) => {
                    expect(err).toBeNull();
                    expect(res.body.success).toEqual(true);

                    http.then(server => {
                        server.close(() => {
                            done();
                        });
                    });
                });
        });
    });

    it('Ошибка в req.model.user.getUserById', done => {
        const
            supertest = require('supertest'),
            http = require('../server').default,
            request = http.then(server => {
                return supertest.agent(server);
            });

        jest.mock('../db', () => {
            return {
                init: new Promise((resolve) => {
                    resolve();
                }),

                db: {
                    collection: jest.fn()
                        // Mock для req.model.user.getUserById
                        .mockImplementationOnce(() => {
                            return {
                                find() {
                                    return {
                                        limit() {
                                            return {
                                                toArray() {
                                                    return new Promise((resolve, reject) => {
                                                        reject(Error('req.model.user.getUserById.error'));
                                                    });
                                                },
                                            };
                                        },
                                    };
                                },
                            };
                        }),
                },
            };
        });

        request.then(agent => {
            agent
                .post('/api/password')
                .send({
                    password: 'fake.password',
                })
                .set('x-access-token', 'fake.token.success')
                .expect(500)
                .end((err, res) => {
                    expect(err).toBeNull();
                    expect(res.body.errors).toEqual(['Internal server error']);

                    http.then(server => {
                        server.close(() => {
                            done();
                        });
                    });
                });
        });
    });

    it('Не авторизированный пользователь по токену', done => {
        const
            supertest = require('supertest'),
            http = require('../server').default,
            request = http.then(server => {
                return supertest.agent(server);
            });

        request.then(agent => {
            agent
                .post('/api/password')
                .send({
                    password: 'fake.password',
                })
                .set('x-access-token', 'fake.token.invalid')
                .expect(403)
                .end((err, res) => {
                    expect(err).toBeNull();
                    expect(res.body.errors).toEqual(['Forbidden resource']);

                    http.then(server => {
                        server.close(() => {
                            done();
                        });
                    });
                });
        });
    });

    it('Не авторизированный пользователь', done => {
        const
            supertest = require('supertest'),
            http = require('../server').default,
            request = http.then(server => {
                return supertest.agent(server);
            });

        jest.mock('../db', () => {
            return {
                init: new Promise((resolve) => {
                    resolve();
                }),

                db: {
                    collection: jest.fn()
                        // Mock для req.model.user.getUserById
                        .mockImplementationOnce(() => {
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
                        }),
                },
            };
        });

        request.then(agent => {
            agent
                .post('/api/password')
                .send({
                    password: 'fake.password',
                })
                .set('x-access-token', 'fake.token.success')
                .expect(403)
                .end((err, res) => {
                    expect(err).toBeNull();
                    expect(res.body.errors).toEqual(['Forbidden resource']);

                    http.then(server => {
                        server.close(() => {
                            done();
                        });
                    });
                });
        });
    });

    it('Ошибка валидации пароля', done => {
        const
            supertest = require('supertest'),
            http = require('../server').default,
            request = http.then(server => {
                return supertest.agent(server);
            });

        jest.mock('../db', () => {
            return {
                init: new Promise((resolve) => {
                    resolve();
                }),

                db: {
                    collection: jest.fn()
                        // Mock для req.model.user.getUserById
                        .mockImplementationOnce(() => {
                            return {
                                find() {
                                    return {
                                        limit() {
                                            return {
                                                toArray() {
                                                    return new Promise(resolve => {
                                                        resolve([{
                                                            _id: 'fake._id',
                                                            email: 'fake@email.com',
                                                            address: 'fake.address',
                                                            salt: 'fake.salt',
                                                        }]);
                                                    });
                                                },
                                            };
                                        },
                                    };
                                },
                            };
                        }),
                },
            };
        });

        request.then(agent => {
            agent
                .post('/api/password')
                .send({
                    password: '',
                })
                .set('x-access-token', 'fake.token.success')
                .expect(500)
                .end((err, res) => {
                    expect(err).toBeNull();
                    expect(res.body.errors).toEqual(['Internal server error']);

                    http.then(server => {
                        server.close(() => {
                            done();
                        });
                    });
                });
        });
    });

    it('Ошибка в req.model.user.setPasswordId', done => {
        const
            supertest = require('supertest'),
            http = require('../server').default,
            request = http.then(server => {
                return supertest.agent(server);
            });

        jest.mock('../db', () => {
            return {
                init: new Promise((resolve) => {
                    resolve();
                }),

                db: {
                    collection: jest.fn()
                        // Mock для req.model.user.getUserById
                        .mockImplementationOnce(() => {
                            return {
                                find() {
                                    return {
                                        limit() {
                                            return {
                                                toArray() {
                                                    return new Promise(resolve => {
                                                        resolve([{
                                                            _id: 'fake._id',
                                                            email: 'fake@email.com',
                                                            address: 'fake.address',
                                                            salt: 'fake.salt',
                                                        }]);
                                                    });
                                                },
                                            };
                                        },
                                    };
                                },
                            };
                        })

                        // Mock для req.model.user.setPasswordId
                        .mockImplementationOnce(() => {
                            return {
                                updateOne() {
                                    return new Promise((resolve, reject) => {
                                        reject(Error('req.model.user.setPasswordId.error'));
                                    });
                                },
                            };
                        }),
                },
            };
        });

        request.then(agent => {
            agent
                .post('/api/password')
                .send({
                    password: 'fake.password',
                })
                .set('x-access-token', 'fake.token.success')
                .expect(500)
                .end((err, res) => {
                    expect(err).toBeNull();
                    expect(res.body.errors).toEqual(['Internal server error']);

                    http.then(server => {
                        server.close(() => {
                            done();
                        });
                    });
                });
        });
    });
});
