/**
 * Интеграционный тест для API метода /user/create
 */

jest.mock('../exception');

/* eslint max-len: ["error", 130] */
describe('Регистрация пользователя (/user/create) - ', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешная регистрация', done => {
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
                        })

                        // Mock для req.model.user.getUserByEmail
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
                        })

                        // Mock для req.model.user.create
                        .mockImplementationOnce(() => {
                            return {
                                insertOne() {
                                    return new Promise(resolve => {
                                        resolve({
                                            insertedId: 'fake.inserted.id',
                                        });
                                    });
                                },
                            };
                        }),
                },
            };
        });

        jest.mock('nodemailer', () => {
            return {
                createTransport() {
                    return {
                        sendMail(opt, cb) {
                            cb();
                        },
                    };
                },
            };
        });

        request.then(agent => {
            agent
                .post('/user/create')
                .send({ email: 'fake@user.ru' })
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

    it('Если пользователь авторизован', done => {
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
                                                            email: 'fake@user.com',
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
                .post('/user/create')
                .send({ email: 'fake@user.ru' })
                .set('x-access-token', 'fake.token.success')
                .expect(200)
                .end((err, res) => {
                    expect(err).toBeNull();
                    expect(res.body.success).toEqual(false);

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
                .post('/user/create')
                .send({ email: 'fake@user.ru' })
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

    it('Ошибка валидации email', done => {
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
                .post('/user/create')
                .send({ email: 'fake.invalid.email' })
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

    it('Ошибка в req.model.user.getUserByEmail', done => {
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
                        })

                        // Mock для req.model.user.getUserByEmail
                        .mockImplementationOnce(() => {
                            return {
                                find() {
                                    return {
                                        limit() {
                                            return {
                                                toArray() {
                                                    return new Promise((resolve, reject) => {
                                                        reject(Error('req.model.user.getUserByEmail.error'));
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
                .post('/user/create')
                .send({ email: 'fake@user.ru' })
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

    it('Ошибка в req.model.user.create', done => {
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
                        })

                        // Mock для req.model.user.getUserByEmail
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
                        })

                        // Mock для req.model.user.create
                        .mockImplementationOnce(() => {
                            return {
                                insertOne() {
                                    return new Promise((resolve, reject) => {
                                        reject(Error('req.model.user.create.error'));
                                    });
                                },
                            };
                        }),
                },
            };
        });

        request.then(agent => {
            agent
                .post('/user/create')
                .send({ email: 'fake@user.ru' })
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

    it('Ошибка в req.email', done => {
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
                        })

                        // Mock для req.model.user.getUserByEmail
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
                        })

                        // Mock для req.model.user.create
                        .mockImplementationOnce(() => {
                            return {
                                insertOne() {
                                    return new Promise(resolve => {
                                        resolve({
                                            insertedId: 'fake.inserted.id',
                                        });
                                    });
                                },
                            };
                        }),
                },
            };
        });

        jest.mock('nodemailer', () => {
            return {
                createTransport() {
                    return {
                        sendMail(opt, cb) {
                            cb(Error('req.email.error'));
                        },
                    };
                },
            };
        });

        request.then(agent => {
            agent
                .post('/user/create')
                .send({ email: 'fake@user.ru' })
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
