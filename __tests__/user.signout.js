/**
 * Интеграционный тест для API метода /user/signout
 */

jest.mock('../exception');

/* eslint max-len: ["error", 120] */
describe('Выход из сессии (/user/signout) - ', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешный выход из сессии', done => {
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
                        // Mock для req.model.user.getUserBySession
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
                                                        }]);
                                                    });
                                                },
                                            };
                                        },
                                    };
                                },
                            };
                        })

                        // Mock для req.model.user.unsetSessionById
                        .mockImplementationOnce(() => {
                            return {
                                updateOne(query) {
                                    expect(query).toHaveProperty('_id', 'fake._id');

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
                .get('/user/signout')
                .set('Cookie', 'fake.session.id')
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

    it('Если пользователь не авторизован', done => {
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
                        // Mock для req.model.user.getUserBySession
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
                .get('/user/signout')
                .set('Cookie', 'fake.session.id')
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

    it('Ошибка в req.model.user.getUserBySession', done => {
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
                        // Mock для req.model.user.getUserBySession
                        .mockImplementationOnce(() => {
                            return {
                                find() {
                                    return {
                                        limit() {
                                            return {
                                                toArray() {
                                                    return new Promise((resolve, reject) => {
                                                        reject(Error('req.model.user.getUserBySession.error'));
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
                .get('/user/signout')
                .set('Cookie', 'fake.session.id')
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

    it('Ошибка в req.model.user.unsetSessionById', done => {
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
                        // Mock для req.model.user.getUserBySession
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
                                                        }]);
                                                    });
                                                },
                                            };
                                        },
                                    };
                                },
                            };
                        })

                        // Mock для req.model.user.unsetSessionById
                        .mockImplementationOnce(() => {
                            return {
                                updateOne() {
                                    return new Promise((resolve, reject) => {
                                        reject(Error('req.model.user.unsetSessionById.error'));
                                    });
                                },
                            };
                        }),
                },
            };
        });

        request.then(agent => {
            agent
                .get('/user/signout')
                .set('Cookie', 'fake.session.id')
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
