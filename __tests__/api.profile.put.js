/**
 * Интеграционный тест для API метода /api/profile
 * Метод PUT
 */

jest.mock('../exception');

/* eslint max-len: ["error", 120] */
describe('Обновление данных профиля (/api/profile) - ', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное обновление данных', done => {
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
                                                            email: 'fake@email.com',
                                                            address: 'fake.address',
                                                            salt: 'fake.salt',
                                                            period: 'fake.period',
                                                        }]);
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

                        // Mock для req.model.user.update
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
                .put('/api/profile')
                .send({
                    email: 'fake@mail.ru',
                    address: '127.0.0.1',
                })
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

    it('Дублирование email', done => {
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
                                                            email: 'fake@email.com',
                                                            address: 'fake.address',
                                                            salt: 'fake.salt',
                                                            period: 'fake.period',
                                                        }]);
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
                .put('/api/profile')
                .send({
                    email: 'fake@mail.ru',
                    address: '127.0.0.1',
                })
                .set('Cookie', 'fake.session.id')
                .expect(200)
                .end((err, res) => {
                    expect(err).toBeNull();
                    expect(res.body.success).toEqual(false);
                    expect(res.body.exist).toEqual(true);

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
                .put('/api/profile')
                .send({
                    email: 'fake@mail.ru',
                    address: '127.0.0.1',
                })
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
                .put('/api/profile')
                .send({
                    email: 'fake@mail.ru',
                    address: '127.0.0.1',
                })
                .set('Cookie', 'fake.session.id')
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
                                                            email: 'fake@email.com',
                                                            address: 'fake.address',
                                                            salt: 'fake.salt',
                                                            period: 'fake.period',
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
                .put('/api/profile')
                .send({
                    email: 'fake.invalid.mail',
                    address: '127.0.0.1',
                })
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

    it('Ошибка валидации IP', done => {
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
                                                            email: 'fake@email.com',
                                                            address: 'fake.address',
                                                            salt: 'fake.salt',
                                                            period: 'fake.period',
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
                .put('/api/profile')
                .send({
                    email: 'fake@mail.com',
                    address: 'fake.invalid.ip',
                })
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
                                                            email: 'fake@email.com',
                                                            address: 'fake.address',
                                                            salt: 'fake.salt',
                                                            period: 'fake.period',
                                                        }]);
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
                .put('/api/profile')
                .send({
                    email: 'fake@mail.ru',
                    address: '127.0.0.1',
                })
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

    it('Ошибка в req.model.user.update', done => {
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
                                                            email: 'fake@email.com',
                                                            address: 'fake.address',
                                                            salt: 'fake.salt',
                                                            period: 'fake.period',
                                                        }]);
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

                        // Mock для req.model.user.update
                        .mockImplementationOnce(() => {
                            return {
                                updateOne() {
                                    return new Promise((resolve, reject) => {
                                        reject(Error('req.model.user.update.error'));
                                    });
                                },
                            };
                        }),
                },
            };
        });

        request.then(agent => {
            agent
                .put('/api/profile')
                .send({
                    email: 'fake@mail.ru',
                    address: '127.0.0.1',
                })
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
