/**
 * Интеграционный тест для API метода /user/forgot
 */

jest.mock('../exception');

describe('Сброс пароля (/user/forgot) - ', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешный сброс', done => {
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
                        .mockImplementationOnce(() => {
                            return {
                                updateOne(query, data) {
                                    return new Promise(resolve => {
                                        resolve({
                                            mongoResult: {
                                                result: {
                                                    nModified: 1,
                                                },
                                            },
                                        });
                                    });
                                },
                            };
                        }),
                },
            }
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
                .post('/user/forgot')
                .send({ email: 'fake@user.ru' })
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
            }
        });

        request.then(agent => {
            agent
                .post('/user/forgot')
                .send({ email: 'fake@user.ru' })
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
});
