/**
 * Тест регистрации пользователя
 */

import supertest from 'supertest';
import http from '../server';

jest.mock('../exception');
jest.mock('../db');

const request = http.then(server => {
    return supertest.agent(server);
});

describe('Регистрация пользователя (/user/create) - ', () => {
    it('Успешная регистрация', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'simple@email.ru' })
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.success).toEqual(true); }
        );
    });

    it('Ошибка в getUserBySession', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'simple@email.ru' })
                    .set('Cookie', 'error')
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Ошибка валидации email', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'Invalid email' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Ошибка в getUserByEmail', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'mongo.find.error@email.ru' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Ошибка в create (mongo)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'mongo.insertone.error@email.ru' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Ошибка в create (nedb)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'nedb.insert.error@email.ru' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Ошибка в sendMail', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'nodemailer.sendmail.error@email.ru' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });
});

describe('Сброс пароля (/user/forgot) - ', () => {
    it('Успешный сброс', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'simple@email.ru' })
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.success).toEqual(true); }
        );
    });

    it('Ошибка в getUserBySession', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'simple@email.ru' })
                    .set('Cookie', 'error')
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Ошибка валидации email', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'Invalid email' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Ошибка в setPasswordByEmail (mongo)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'mongo.updateone.error@email.ru' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Ошибка в setPasswordByEmail (nedb)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'nedb.update.error@email.ru' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Отсутствие затронутых записей в БД', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'mongo.updateone.nomodified@email.ru' })
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.success).toEqual(false); }
        );
    });

    it('Ошибка в sendMail', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'nodemailer.sendmail.error@email.ru' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });
});

describe('Авторизация пользователя (/user/signin) - ', () => {
    it('Успешная авторизация', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/signin')
                    .send({
                        email: 'mongo.find.user@email.ru',
                        password: 'pMBXHsgErq1V',
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.success).toEqual(true); }
        );
    });

    it('Ошибка валидации email', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/signin')
                    .send({
                        email: 'user.signin.incorrect.email.test',
                        password: 'pMBXHsgErq1V',
                    })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Ошибка в getUserByEmail (mongo)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/signin')
                    .send({
                        email: 'mongo.find.error@email.ru',
                        password: 'pMBXHsgErq1V',
                    })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Ошибка в setSessionById (mongo)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/signin')
                    .send({
                        email: 'mongo.find.user@email.ru',
                        password: 'pMBXHsgErq1V',
                    })
                    .set('Cookie', 'mongo.updateone.error')
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Ошибка в setSessionById (nedb)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/signin')
                    .send({
                        email: 'mongo.find.user@email.ru',
                        password: 'pMBXHsgErq1V',
                    })
                    .set('Cookie', 'nedb.update.error')
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });
});

describe('Выход из сессии (/user/signout) - ', () => {
    it('Успешный выход из сессии', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/user/signout')
                    .set('Cookie', 'authorized')
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.success).toEqual(true); }
        );
    });

    it('Ошибка в unsetSessionById (mongo)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/user/signout')
                    .set('Cookie', 'unsetSessionById.mongo.error')
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });
    //
    // it('Ошибка в unsetSessionById (nedb)', () => {
    //    return new Promise((resolve, reject) => {
    //        request.then(agent => {
    //            agent
    //                .get('/user/signout')
    //                .expect(500)
    //                .end((err, res) => {
    //                    if (err) {
    //                        reject(err);
    //                        return;
    //                    }
    //                    resolve(res);
    //                });
    //        });
    //    }).then(
    //        res => { expect(res.body.errors).toEqual(['Internal server error']); }
    //    );
    // });
});
//
// describe('Запрос данных профиля (/api/profile) - ', () => {
//     afterEach(() => {
//         http.then(server => {
//             server.close();
//         });
//     });
//     it('Успешное получение данных', () => {
//         return new Promise((resolve, reject) => {
//             request.then(agent => {
//                 agent
//                     .get('/api/profile')
//                     .expect(200)
//                     .end((err, res) => {
//                         if (err) {
//                             reject(err);
//                             return;
//                         }
//                         resolve(res);
//                     });
//             });
//         }).then(
//             res => {
//                 expect(res.body.success).toEqual(true);
//                 expect(res.body.profile.email).toEqual('shukhrat@ismax.ru');
//             }
//         );
//     });
// });

