/**
 * Интеграционный тест для API метода /review
 */

jest.mock('../exception');

/* eslint max-len: ["error", 120] */
// TODO: Замокать request и доделать
describe('Запрос списка отзывов (/review) - ', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    // it('Успешное получение списка тозывов', done => {
    //     const
    //         supertest = require('supertest'),
    //         http = require('../server').default,
    //         request = http.then(server => {
    //             return supertest.agent(server);
    //         });
    //
    //     jest.mock('../db', () => {
    //         return {
    //             init: new Promise((resolve) => {
    //                 resolve();
    //             }),
    //
    //             db: {
    //                 collection: jest.fn()
    //                     // Mock для req.model.user.getUserBySaltAndAddress
    //                     .mockImplementationOnce(() => {
    //                         return {
    //                             find() {
    //                                 return {
    //                                     limit() {
    //                                         return {
    //                                             toArray() {
    //                                                 return new Promise(resolve => {
    //                                                     resolve([{
    //                                                         _id: 'fake._id',
    //                                                         email: 'fake@email.com',
    //                                                         address: 'fake.address',
    //                                                         salt: 'fake.salt',
    //                                                     }]);
    //                                                 });
    //                                             },
    //                                         };
    //                                     },
    //                                 };
    //                             },
    //                         };
    //                     }),
    //             },
    //         };
    //     });
    //
    //     request.then(agent => {
    //         agent
    //             .get('/review')
    //             .query({ text: 'ASUS ZenFone 3 Deluxe ZS570KL 64Gb' })
    //             .set('X-Ismax-Key', 'fake.salt')
    //             .set('X-Forwarded-for', '127.0.0.1')
    //             .expect(200)
    //             .end((err, res) => {
    //                 expect(err).toBeNull();
    //                 expect(res.body).toHaveProperty('modelOpinions');
    //
    //                 http.then(server => {
    //                     server.close(() => {
    //                         done();
    //                     });
    //                 });
    //             });
    //     });
    // });
    //
    // it('Успешное получение пустого списка', done => {
    //     const
    //         supertest = require('supertest'),
    //         http = require('../server').default,
    //         request = http.then(server => {
    //             return supertest.agent(server);
    //         });
    //
    //     jest.mock('../db', () => {
    //         return {
    //             init: new Promise((resolve) => {
    //                 resolve();
    //             }),
    //
    //             db: {
    //                 collection: jest.fn()
    //                     // Mock для req.model.user.getUserBySaltAndAddress
    //                     .mockImplementationOnce(() => {
    //                         return {
    //                             find() {
    //                                 return {
    //                                     limit() {
    //                                         return {
    //                                             toArray() {
    //                                                 return new Promise(resolve => {
    //                                                     resolve([{
    //                                                         _id: 'fake._id',
    //                                                         email: 'fake@email.com',
    //                                                         address: 'fake.address',
    //                                                         salt: 'fake.salt',
    //                                                     }]);
    //                                                 });
    //                                             },
    //                                         };
    //                                     },
    //                                 };
    //                             },
    //                         };
    //                     }),
    //             },
    //         };
    //     });
    //
    //     request.then(agent => {
    //         agent
    //             .get('/review')
    //             .query({ text: 'OPTIFIT Envoy SX65' })
    //             .set('X-Ismax-Key', 'fake.salt')
    //             .set('X-Forwarded-for', '127.0.0.1')
    //             .expect(200)
    //             .end((err, res) => {
    //                 expect(err).toBeNull();
    //                 expect(res.body).toEqual([]);
    //
    //                 http.then(server => {
    //                     server.close(() => {
    //                         done();
    //                     });
    //                 });
    //             });
    //     });
    // });

    it('Ошибка в req.model.user.getUserBySaltAndAddress', done => {
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
                        // Mock для req.model.user.getUserBySaltAndAddress
                        .mockImplementationOnce(() => {
                            return {
                                find() {
                                    return {
                                        limit() {
                                            return {
                                                toArray() {
                                                    return new Promise((resolve, reject) => {
                                                        reject(Error('req.model.user.getUserBySaltAndAddress'));
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
                .get('/review')
                .query({ text: 'OPTIFIT Envoy SX65' })
                .set('X-Ismax-Key', 'fake.salt')
                .set('X-Forwarded-for', '127.0.0.1')
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
