import supertest from 'supertest';
import http from '../server';

jest.mock('../exception');

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

const request = http.then(server => {
    return supertest.agent(server);
});

describe('Регистрация пользователя (/user/create) - ', () => {
    afterAll(() => {
        http.then(server => {
            server.close();
        });
    });

    it('Успешная регистрация', done => {
        request.then(agent => {
            agent
                .post('/user/create')
                .send({ email: 'fake@user.ru' })
                .expect(200)
                .end((err, res) => {
                    expect(err).toBeNull();
                    expect(res.body.success).toEqual(true);
                    done();
                });
        });
    });
});
